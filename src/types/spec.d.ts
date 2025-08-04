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
  analysisComplete: boolean;
  selected?: boolean;
}

export interface GeneratedImage {
  code?: string;
  render_image?: string;
  generating: boolean;
}

export interface DesignSpec {
  icon: string;
  label: string;
  value: number;
}
