import axios from "./RequestHelper";
import type { Ref } from "vue";
import type {
  Component,
  Region,
  PageComposition,
  SPEC,
  GeneratedImage,
  DesignSpec,
  UploadImage,
  Reference,
} from "~/types";

function filterSelectedComponents(components: Component[]): Component[] {
  return components.filter((component) => component.selected === true);
}

function filterSelectedRegions(regions: Region[]): Region[] {
  return regions
    .filter((region) => region.selected === true)
    .map((region) => ({
      ...region,
      ContainedComponents: filterSelectedComponents(region.ContainedComponents),
    }));
}

function filterSelectedPageStructure(
  pageStructure: PageComposition
): PageComposition {
  return {
    SectionDivision: filterSelectedRegions(pageStructure.SectionDivision),
  };
}

export function checkMissingSpecs(designSpecs: DesignSpec) {
  const missingSpecs = [];
  for (const key in designSpecs) {
    if (designSpecs[key].value < 0) {
      missingSpecs.push(key);
    }
  }
  return missingSpecs;
}

export function imageUploadUtil(uploadedPages: Ref<UploadImage[]>, file: File, currentPageIndex: Ref<number>) {
  const imageId = Date.now().toString();
  const newImage: UploadImage = {
    id: imageId,
    name: file.name,
    url: URL.createObjectURL(file),
    file: file,
    analysisComplete: false,
  };
  uploadedPages.value.push(newImage);
  currentPageIndex.value = uploadedPages.value.length - 1;

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
            spec.PageStructure.SectionDivision.forEach((region) => {
              region.selected = true;
              region.ContainedComponents.forEach((component) => {
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
    axios.post("/image_reference", {
      image: base64Image,
      save_name: file.name,
      spec: ""
    })
    .then((response) => {
      if(response.data.success) {
        console.log("UI attribute: ", response.data.data.attribute);
        const imageIndex = uploadedPages.value.findIndex(
            (img) => img.id === imageId
          );
        if (imageIndex !== -1) {
          const reference = response.data.data.attribute as Reference;
          uploadedPages.value[imageIndex].reference = reference;
        }
      }
    })
    .catch(error => {
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
  const spec: Partial<SPEC> = {};

  for (const key in designSpecs.value) {
    const designSpec = designSpecs.value[key];
    const pageIndex = designSpec.value;
    if (pageIndex >= 0 && pageIndex < uploadedPages.value.length) {
      const page = uploadedPages.value[pageIndex];
      if (page && page.spec) {
        switch (key) {
          case "Color":
            spec.VisualStyle = page.spec.VisualStyle;
            break;
          case "Information":
            spec.UIDescription = page.spec.UIDescription;
            break;
          case "Layout":
            spec.PageStructure = filterSelectedPageStructure(
              page.spec.PageStructure
            );
            break;
        }
      }
    }
  }

  const generatedPage: GeneratedImage = {
    spec: spec as SPEC,
    generating: true,
    code: "",
    render_image: "",
    time: new Date(),
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
        generatedPages.value[index].spec = response.data.data.spec as SPEC;
      }
    })
    .catch((error) => {
      console.error("Error generating image:", error);
    });
  
    console.log(generatedPage);
}
