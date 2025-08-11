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

export interface UploadImage {
  id: string;
  name: string;
  url: string;
  file?: File;
  spec?: SPEC;
  analysisComplete: boolean;
  selected?: boolean;
}

export interface GeneratedImage {
  spec: SPEC;
  code?: string;
  render_image?: string;
  generating: boolean;
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

export interface Reference {
  承担的功能: string;
  承载的信息: string;
  布局样式: string;
  组件的配色样式: string;
  所处的位置: string;
  组件内的布局样式: string;
}
