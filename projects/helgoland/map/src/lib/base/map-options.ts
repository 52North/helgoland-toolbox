export interface LayerOptions {
    label: string;
    visible: boolean;
    layer: L.Layer;
}

export type LayerMap = Map<string, LayerOptions>;
