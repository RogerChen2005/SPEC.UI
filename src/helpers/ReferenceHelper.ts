import axios from "./RequestHelper";
import type { Ref } from "vue";
import type {
  Component,
  PageComposition,
  SPEC,
  GeneratedImage,
  DesignSpec,
  UploadImage,
  Section,
  SpecType,
  UIDesignSpecification,
} from "~/types";

function filterSelectedComponents(components: Component[]): Component[] {
  return components.filter((component) => component.selected === true);
}

function filterSelectedSections(sections: Section[]): Section[] {
  return sections
    .filter((section) => section.selected === true)
    .map((section) => ({
      ...section,
      Contained_Components: filterSelectedComponents(section.Contained_Components),
    }));
}

function filterSelectedPageStructure(
  pageStructure: PageComposition
): PageComposition {
  return {
    Sections: filterSelectedSections(pageStructure.Sections),
  };
}

export function checkMissingSpecs(designSpecs: DesignSpec): (SpecType)[] {
  const missingSpecs: (SpecType)[] = [];
  const keys = Object.keys(designSpecs) as Array<SpecType>;
  
  for (const key of keys) {
    if (designSpecs[key].value < 0) {
      missingSpecs.push(key);
    }
  }
  return missingSpecs;
}

export function imageUploadUtil(uploadedPages: Ref<UploadImage[]>, file: File, callback: () => void) {
  const imageId = Date.now().toString();
  const newImage: UploadImage = {
    id: imageId,
    name: file.name,
    url: URL.createObjectURL(file),
    file: file,
    analysisComplete: false,
  };
  uploadedPages.value.push(newImage);
  callback();

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64Image = (reader.result as string).split(",")[1];
    axios
      .post("/image_to_spec", {
        image: base64Image,
        save_name: file.name,
      })
      .then((response) => {
        if (response.data.success) {
          console.log("Generated UI Spec:", response.data.data.spec);
          const imageIndex = uploadedPages.value.findIndex(
            (img) => img.id === imageId
          );
          if (imageIndex !== -1) {
            const spec = response.data.data.spec as SPEC;
            spec.Page_Composition.Sections.forEach((region) => {
              region.selected = true;
              region.Contained_Components.forEach((component) => {
                component.selected = true;
              });
            });
            uploadedPages.value[imageIndex].spec = spec;
            uploadedPages.value[imageIndex].analysisComplete = true;
            uploadedPages.value[imageIndex].selected = true;
          }
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };
}

export function imageGenerationUtil(
  uploadedPages: Ref<UploadImage[]>,
  generatedPages: Ref<GeneratedImage[]>,
  promptText: Ref<string>,
  designSpecs: Ref<DesignSpec>
) {
  const spec: Partial<SPEC> = {
  };
  const keys = Object.keys(designSpecs) as Array<SpecType>;
  
  let ui_design_specification:Partial<UIDesignSpecification> = {};
  for (const key of keys) {
    if (key === "Page_Composition") {
      spec.Page_Composition= filterSelectedPageStructure(
        uploadedPages.value[designSpecs.value[key].value].spec?.Page_Composition || {
          Sections: [],
        }
      );
    }
    else {
      ui_design_specification[key] = uploadedPages.value[designSpecs.value[key].value].spec?.UI_Design_Specification[key] || "";
    }
  }
  spec.UI_Design_Specification = ui_design_specification as UIDesignSpecification;

  const generatedPage: GeneratedImage = {
    spec: spec as SPEC,
    generating: true,
    code: "",
    render_image: "",
  };

  generatedPages.value.push(generatedPage);

  let index = generatedPages.value.length - 1;

  axios
    .post("/init_ui_generation", {
      text: promptText.value,
      spec: spec,
    })
    .then((response) => {
      if (response.data.success) {
        generatedPages.value[index].code = response.data.data.code;
        generatedPages.value[index].render_image =
          "data:image/png;base64," + response.data.data.render_image;
        generatedPages.value[index].generating = false;
        const fileData = JSON.stringify(response.data, null, 2);
        const blob = new Blob([fileData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "example.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    })
    .catch((error) => {
      console.error("Error generating image:", error);
    });
  
    console.log(generatedPage);
}
