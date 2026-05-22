import type { Workflow, WorkflowNode } from './types.js';
/**
 * Workflow utility functions for tree traversal and manipulation
 */
/**
 * Deep clone a workflow to ensure immutability
 */
export declare function cloneWorkflow(workflow: Workflow): Workflow;
/**
 * Deep clone a workflow node
 */
export declare function cloneNode(node: WorkflowNode): WorkflowNode;
/**
 * Find a node by ID anywhere in the workflow tree
 */
export declare function findNodeById(node: WorkflowNode, id: string): WorkflowNode | null;
/**
 * Remove a node by ID from the workflow tree
 */
export declare function removeNodeById(node: WorkflowNode, id: string): WorkflowNode;
/**
 * Insert a node into the workflow tree at a specific location
 */
export declare function insertNodeIntoWorkflow(parent: WorkflowNode, nodeToInsert: WorkflowNode, connectionType?: 'child' | 'branch' | 'task', branchKey?: string): void;
/**
 * Collect all nodes in the workflow (depth-first)
 */
export declare function getAllNodes(node: WorkflowNode): WorkflowNode[];
/**
 * Get all parent node IDs for a given node (path from root to node)
 */
export declare function getNodePath(rootNode: WorkflowNode, targetId: string): string[];
/**
 * Check if a node is a descendant of another node
 */
export declare function isDescendant(rootNode: WorkflowNode, potentialParentId: string, nodeId: string): boolean;
/**
 * Replace a node in the tree
 */
export declare function replaceNode(node: WorkflowNode, targetId: string, replacement: WorkflowNode): WorkflowNode;
