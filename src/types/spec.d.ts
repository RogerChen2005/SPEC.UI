import { CompleteStatus } from "~/enums";

export interface LayoutArea {
  id: number;
  title: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Color_Scheme = Record<string, string>;

export interface Component {
  Color_Scheme: Color_Scheme;
  Component_Layout_Style: string;
  Component_Type: string;
  Function: string;
  selected?: boolean;
  Data_Component_Id: string;
}

export interface Section {
  Color_Scheme: Color_Scheme;
  Component_Layout_in_Section: string;
  Contained_Components: Component[];
  Section_Name: string;
  Section_Position_on_Page: string;
  selected?: boolean;
  Data_Section_Id: string;
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
  id: string;
  spec?: SPEC;
  complete: CompleteStatus;
  url: string;
}

export interface UploadImage extends BaseImage {
  name: string;
  file?: File;
}

export interface GeneratedImage extends BaseImage {
  code?: string;
  time: Date;
  mark?: string;
  reference: number[];
}

export type SpecType = keyof UIDesignSpecification;

export type DesignSpec = Record<
  SpecType,
  {
    label: string;
    icon: string;
    value: number;
    customPrompt?: string;
  }
>;

export interface EditInfo {
  sectionIndex: number;
  componentIndex: number;
}

export interface LibraryInfo {
  name: string;
  label: string;
  path: string;
  selected: boolean;
  pages: UploadImage[];
}
