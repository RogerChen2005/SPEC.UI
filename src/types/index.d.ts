export type ThemePreference = 'dark' | 'light' | 'system';

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
    componentId: string;
    componentType: 'Image' | 'Text' | 'Divider';
    position: string;
    function: string;
    information: string;
    layoutStyle: string;
    colorStyle?: string;
}

export interface Region {
    BBox: string;
    包含组件: Component[];
    区域内布局样式: string;
    区域名称: string;
    区域编号: string;
    所处的位置: string;
    selected?: boolean; 
}

export interface UIDescription {
    产品场景: string;
    功能简述: string;
    整体描述: string;
    核心功能: string;
    目标用户: string;
}

export interface VisualStyle {
    colorSystem: string;
    designStyle: string;
    overallTone: string;
}

export interface PageComposition {
    区域划分: Region[];
}

export interface SPEC {
    UI描述: UIDescription;
    visualStyle: VisualStyle;
    页面构成: PageComposition;
}

export interface UploadImage {
    id: string;
    name: string;
    url: string;
    file?: File;
    spec?: SPEC;
    analysisComplete: boolean;
}