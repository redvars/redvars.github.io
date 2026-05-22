import type { Workflow, WorkflowNode, WorkflowCommand } from './types.js';
/**
 * Add Node Command
 */
export declare class AddNodeCommand implements WorkflowCommand {
    private nodeToAdd;
    private parentNodeId;
    private connectionType;
    private branchKey?;
    description: string;
    constructor(nodeToAdd: WorkflowNode, parentNodeId: string, connectionType?: 'child' | 'branch' | 'task', branchKey?: string | undefined);
    execute(workflow: Workflow): Workflow;
    undo(workflow: Workflow): Workflow;
}
/**
 * Delete Node Command
 */
export declare class DeleteNodeCommand implements WorkflowCommand {
    private nodeId;
    description: string;
    private deletedNode;
    private parentReference;
    constructor(nodeId: string, workflow?: Workflow);
    private captureNodeContext;
    private findParentReference;
    execute(workflow: Workflow): Workflow;
    undo(workflow: Workflow): Workflow;
}
/**
 * Edit Node Command
 */
export declare class EditNodeCommand implements WorkflowCommand {
    private nodeId;
    private updates;
    description: string;
    private previousState;
    constructor(nodeId: string, updates: Partial<WorkflowNode>, workflow?: Workflow);
    execute(workflow: Workflow): Workflow;
    undo(workflow: Workflow): Workflow;
}
/**
 * Move Node Command - reorder in array or change parent
 */
export declare class MoveNodeCommand implements WorkflowCommand {
    private nodeId;
    private newParentId;
    private newIndex;
    private newConnectionType;
    private newBranchKey?;
    description: string;
    private previousState;
    constructor(nodeId: string, newParentId: string, newIndex: number, newConnectionType?: 'child' | 'branch' | 'task', newBranchKey?: string | undefined, workflow?: Workflow);
    private captureCurrentPosition;
    execute(workflow: Workflow): Workflow;
    undo(workflow: Workflow): Workflow;
}
/**
 * Batch Command - combine multiple commands into one undo/redo step
 */
export declare class BatchCommand implements WorkflowCommand {
    private commands;
    description: string;
    constructor(commands: WorkflowCommand[], description?: string);
    execute(workflow: Workflow): Workflow;
    undo(workflow: Workflow): Workflow;
}
