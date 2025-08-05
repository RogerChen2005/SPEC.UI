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
  ComponentID: string;
  ComponentType: string;
  ComponentPosition: string;
  Functionality: string;
  InformationCarried: string;
  ComponentLayoutStyle: string;
  ComponentColorStyle?: string;
  selected?: boolean;
}

export interface Region {
  BBox: string;
  ContainedComponents: Component[];
  LayoutStyleWithinSection: string;
  SectionName: string;
  SectionID: string;
  Location: string;
  selected?: boolean;
}

export interface UIDescription {
  ProductScenario: string;
  FunctionSummary: string;
  OverallDescription: string;
  CoreFunctions: string[];
  TargetUsers: string;
}

export interface VisualStyle {
  ColorScheme: string;
  DesignStyle: string;
  OverallTone: string;
}

export interface PageComposition {
  SectionDivision: Region[];
}

export interface SPEC {
  UIDescription: UIDescription;
  VisualStyle: VisualStyle;
  PageStructure: PageComposition;
}

export interface UploadImage {
  id: string;
  name: string;
  url: string;
  file?: File;
  spec?: SPEC;
  reference?: Reference;
  analysisComplete: boolean;
  selected?: boolean;
}

export interface GeneratedImage {
  spec: SPEC;
  code?: string;
  render_image?: string;
  generating: boolean;
}

export interface DesignSpec {
  [key:string] : {
    icon: string;
    value: number;
  }
}

export interface Reference {
  承担的功能: string;
  承载的信息: string;
  布局样式: string;
  组件的配色样式: string;
  所处的位置: string;
  组件内的布局样式: string;
}