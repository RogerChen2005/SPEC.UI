import type exp from "constants";
export interface LayoutArea {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Component {
  Color_Scheme: string;
  Component_Layout_Style: string;
  Component_Type: string;
  Function: string;
  selected?: boolean;
}

export interface Section {
  Color_Scheme: string;
  Component_Layout_in_Section: string;
  Contained_Components: Component[];
  Section_Name: string;
  Section_Position_on_Page: string;
  selected?: boolean;
}

export interface PageComposition {
  Sections: Section[];
}

export interface UIDesignSpecification {
  Color_System: string;
  Layout_Structure: string;
  Shape_Language: string;
  Usage_Scenario: string;
}

export interface SPEC {
  Page_Composition: PageComposition;
  UI_Design_Specification: UIDesignSpecification;
}

export interface BaseImage {
  spec?: SPEC;
  complete: boolean;
  url: string;
}

export interface UploadImage extends BaseImage {
  id: string;
  name: string;
  file?: File;
}

export interface GeneratedImage extends BaseImage {
  code?: string;
  time: Date;
  mark?: string;
  reference: number;
}

export type SpecType = keyof UIDesignSpecification;

export type DesignSpec = Record<
  SpecType,
  {
    label: string;
    icon: string;
    value: number;
  }
>;

export interface EditInfo {
  sectionIndex: number;
  componentIndex: number;
}
