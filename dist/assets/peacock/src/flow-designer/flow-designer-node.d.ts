import { LitElement } from 'lit';
import type { WorkflowNode } from './types.js';
/**
 * Individual node component for flow designer
 * Renders a single workflow node with customizable slot templates
 *
 * @tag wc-flow-designer-node
 * @rawTag flow-designer-node
 * @wip true
 */
export declare class FlowDesignerNode extends LitElement {
    static styles: import("lit").CSSResultGroup[];
    /**
     * The workflow node to render
     */
    node: WorkflowNode;
    /**
     * Whether this node is currently selected
     */
    isSelected: boolean;
    /**
     * Whether this node is in edit mode
     */
    isEditing: boolean;
    /**
     * Whether this node is disabled
     */
    disabled: boolean;
    /**
     * Whether to show the delete button
     */
    showDelete: boolean;
    private _handleClick;
    private _handleDoubleClick;
    private _handleDelete;
    private _handleMouseEnter;
    private _handleMouseLeave;
    render(): import("lit-html").TemplateResult<1>;
    private _renderDefaultHeader;
    private _renderDefaultBody;
}
declare global {
    interface HTMLElementTagNameMap {
        'wc-flow-designer-node': FlowDesignerNode;
    }
}
