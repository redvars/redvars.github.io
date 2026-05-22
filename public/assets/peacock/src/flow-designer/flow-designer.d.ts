import { LitElement } from 'lit';
import '../toolbar/toolbar.js';
import '../button/icon-button/icon-button.js';
import '../icon/icon.js';
import './flow-designer-node.js';
import type { Workflow, WorkflowNode } from './types.js';
/**
 * @label Flow Designer
 * @tag wc-flow-designer
 * @rawTag flow-designer
 * @summary Low-code business process flow designer with swimlane layout, undo/redo, and interactive editing.
 *
 * @cssprop --flow-designer-height - Height of the flow designer container. Defaults to 400px.
 * @cssprop --flow-designer-border-color - Border color of the flow designer. Defaults to outline-variant.
 * @cssprop --flow-designer-background - Background color of the designer. Defaults to surface.
 * @cssprop --flow-designer-border-radius - Corner radius. Defaults to medium shape.
 * @cssprop --flow-designer-action-bar-bg - Background color of the action bar. Defaults to surface-container.
 *
 * @example
 * ```html
 * <wc-flow-designer id="editor"></wc-flow-designer>
 * <script>
 *   const workflow = {
 *     workflow_id: "demo",
 *     nodes: {
 *       id: "node_1",
 *       type: "trigger",
 *       label: "Start"
 *     }
 *   };
 *   document.querySelector('#editor').workflow = workflow;
 * </script>
 * ```
 */
export declare class FlowDesigner extends LitElement {
    static styles: import("lit").CSSResultGroup[];
    /**
     * The workflow definition to display and edit
     */
    workflow: Workflow;
    /**
     * Whether the flow designer is in read-only mode
     */
    readonly: boolean;
    /**
     * Whether the flow designer is disabled
     */
    disabled: boolean;
    /**
     * Show validation errors/warnings
     */
    showValidation: boolean;
    private _editor;
    private _positionedNodes;
    private _history;
    private _historyIndex;
    private scrollElm?;
    private _isDragScrolling;
    private _dragStartX;
    private _dragStartY;
    private _scrollStartX;
    private _scrollStartY;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected willUpdate(): void;
    /**
     * Recalculate layout when workflow changes
     */
    private _recalculateLayout;
    /**
     * Add a new node
     */
    addNode(newNode: WorkflowNode, parentNodeId: string, connectionType?: 'child' | 'branch' | 'task', branchKey?: string): void;
    /**
     * Delete a node by ID
     */
    deleteNode(nodeId: string): void;
    /**
     * Edit a node
     */
    editNode(nodeId: string, updates: Partial<WorkflowNode>): void;
    /**
     * Move a node to a different parent/position
     */
    moveNode(nodeId: string, newParentId: string, newIndex: number, connectionType?: 'child' | 'branch' | 'task', branchKey?: string): void;
    /**
     * Execute a command and add to history
     */
    private _executeCommand;
    /**
     * Undo last operation
     */
    undo(): void;
    /**
     * Redo last undone operation
     */
    redo(): void;
    /**
     * Check if undo is available
     */
    canUndo(): boolean;
    /**
     * Check if redo is available
     */
    canRedo(): boolean;
    /**
     * Export current workflow as JSON
     */
    exportWorkflow(): string;
    /**
     * Validate workflow
     */
    validate(): void;
    private _emitWorkflowChange;
    private _handleKeyDown;
    private _handleMouseUp;
    private _handleCanvasMouseDown;
    private _handleCanvasMouseMove;
    private _handleNodeClick;
    private _handleNodeDelete;
    private _handleNodeEdit;
    private _handleZoomIn;
    private _handleZoomOut;
    protected render(): import("lit-html").TemplateResult<1>;
    private _renderConnectors;
    private _renderSwimlanes;
    private _renderNodes;
}
declare global {
    interface HTMLElementTagNameMap {
        'wc-flow-designer': FlowDesigner;
    }
}
