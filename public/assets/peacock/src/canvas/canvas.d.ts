import { LitElement } from 'lit';
export type CanvasDirection = 'up' | 'down' | 'left' | 'right';
export type CanvasStrokeVariant = 'solid' | 'dashed' | 'animated-dashed';
export interface CanvasPoint {
    x: number;
    y: number;
}
export interface CanvasPathSegment {
    direction: CanvasDirection;
    length: number;
}
interface BaseCanvasShape {
    color?: string;
}
interface BaseCanvasStrokeShape extends BaseCanvasShape {
    variant?: CanvasStrokeVariant;
    showArrow?: boolean;
    clickable?: boolean;
}
export interface CanvasCircleShape extends BaseCanvasShape {
    type: 'circle';
    x?: number;
    y?: number;
    radius?: number;
}
export interface CanvasRectShape extends BaseCanvasShape {
    type: 'rect';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}
export interface CanvasLineShape extends BaseCanvasStrokeShape {
    type: 'line';
    start?: CanvasPoint;
    end?: CanvasPoint;
}
export interface CanvasConnectorShape extends BaseCanvasStrokeShape {
    type: 'connector';
    start?: CanvasPoint;
    path?: CanvasPathSegment[];
}
export type CanvasShape = CanvasCircleShape | CanvasRectShape | CanvasLineShape | CanvasConnectorShape;
/**
 * @label Canvas
 * @tag wc-canvas
 * @rawTag canvas
 * @summary A SVG canvas for drawing shapes, lines, and connectors on a dotted grid.
 *
 * @cssprop --canvas-background - Background color for the canvas wrapper. Defaults to surface-container-low.
 * @cssprop --canvas-dot-color - Color of the background grid dots. Defaults to outline-variant.
 * @cssprop --canvas-line-color - Default stroke color for lines and connectors. Defaults to on-surface.
 * @cssprop --canvas-hover-color - Stroke color on hover for clickable shapes. Defaults to primary.
 * @cssprop --canvas-arrow-color - Stroke color for arrow markers. Defaults to on-surface.
 *
 * @example
 * ```html
 * <wc-canvas id="my-canvas"></wc-canvas>
 * <script>
 *   document.querySelector('#my-canvas').shapes = [
 *     { type: 'circle', x: 0, y: 0, radius: 0.25, color: 'red' },
 *   ];
 * </script>
 * ```
 */
export declare class Canvas extends LitElement {
    static styles: import("lit").CSSResultGroup[];
    /**
     * Array of shape objects to render on the canvas.
     */
    shapes: CanvasShape[];
    /**
     * Padding around the computed viewbox (in grid units).
     */
    padding: number;
    /**
     * Zoom multiplier for the canvas dimensions.
     */
    zoom: number;
    /**
     * Optional viewbox override string (e.g. "0 0 100 100").
     */
    viewbox?: string;
    private static getNextPoint;
    private static updateExtents;
    private static getStrokeVariantClasses;
    private computeShapes;
    private renderBackgroundSvg;
    private renderShapesSvg;
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};
