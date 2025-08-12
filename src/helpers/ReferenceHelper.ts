import axios from "./RequestHelper";
import type { Ref } from "vue";
import { useMessageStore } from "~/store/messageStore";
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
      Contained_Components: filterSelectedComponents(
        section.Contained_Components
      ),
    }));
}

function filterSelectedPageStructure(
  pageStructure: PageComposition
): PageComposition {
  return {
    Sections: filterSelectedSections(pageStructure.Sections),
  };
}

export function checkMissingSpecs(designSpecs: DesignSpec, pageCompositionReference: number): string[] {
  const missingSpecs: string[] = [];
  const keys = Object.keys(designSpecs) as Array<SpecType>;

  for (const key of keys) {
    if (designSpecs[key].value < 0) {
      missingSpecs.push(designSpecs[key].label);
    }
  }

  if (pageCompositionReference < 0) {
    missingSpecs.push("Page Structure");
  }

  return missingSpecs;
}

export function imageUploadUtil(
  uploadedPages: Ref<UploadImage[]>,
  file: File,
  added: () => void,
  end: () => void
) {
  const imageId = Date.now().toString();
  const newImage: UploadImage = {
    id: imageId,
    name: file.name,
    url: URL.createObjectURL(file),
    file: file,
    complete: false,
  };
  uploadedPages.value.push(newImage);
  added();

  const messageStore = useMessageStore();

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const base64Image = (reader.result as string).split(",")[1];

    messageStore.add("Uploading image for analysis...", "info");
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
            spec.Page_Composition.Sections.forEach((section) => {
              section.selected = true;
              section.Contained_Components.forEach((component) => {
                component.selected = true;
              });
            });
            uploadedPages.value[imageIndex].spec = spec;
            uploadedPages.value[imageIndex].complete = true;
            messageStore.add("Image analysis complete", "success");
            end();
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
  pageCompositionReference: Ref<number>,
  designSpecs: Ref<DesignSpec>,
  added: () => void,
) {
  const spec: Partial<SPEC> = {};
  const keys = Object.keys(designSpecs.value) as Array<SpecType>;

  let ui_design_specification: Partial<UIDesignSpecification> = {};
  for (const key of keys) {
    ui_design_specification[key] =
      uploadedPages.value[designSpecs.value[key].value].spec
        ?.UI_Design_Specification[key] || "";
  }

  spec.Page_Composition = filterSelectedPageStructure(
    uploadedPages.value[pageCompositionReference.value].spec
      ?.Page_Composition || {
      Sections: [],
    }
  );
  spec.UI_Design_Specification =
    ui_design_specification as UIDesignSpecification;

  const generatedPage: GeneratedImage = {
    spec: spec as SPEC,
    complete: false,
    code: "",
    url: "",
    time: new Date(),
  };

  generatedPages.value.push(generatedPage);

  added();

  let index = generatedPages.value.length - 1;

  const messageStore = useMessageStore();
  messageStore.add("Generating image...", "info");
  axios
    .post("/init_ui_generation", {
      spec: spec,
    })
    .then((response) => {
      if (response.data.success) {
        messageStore.add("Image generation started", "success");
        console.log("Image generation response:", response.data.data);
        generatedPages.value[index].code = response.data.data.code;
        generatedPages.value[index].url =
          "data:image/png;base64," + response.data.data.render_image;
        generatedPages.value[index].complete = true;
        generatedPages.value[index].spec = response.data.data.spec as SPEC;
      }
    })
    .catch((error) => {
      messageStore.add("Error generating image", "error");
      console.error("Error generating image:", error);
    });
}
