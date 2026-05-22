import type { Workflow, ValidationError } from './types.js';
/**
 * Workflow validation - checks for common errors and inconsistencies
 */
export declare class WorkflowValidator {
    /**
     * Validate entire workflow
     */
    static validate(workflow: Workflow): ValidationError[];
    /**
     * Detect circular loop references
     * A loop_end cannot point to a node that is its own descendant (after the loop_start)
     */
    private static _checkCircularLoops;
    /**
     * Check for orphaned nodes (not reachable from root)
     */
    private static _checkOrphanedNodes;
    /**
     * Check that decision nodes have valid branches
     */
    private static _checkValidBranches;
    /**
     * Check that loop_end nodes reference valid loop_start nodes
     */
    private static _checkMissingTargets;
    /**
     * Check that fork nodes have corresponding join nodes
     */
    private static _checkForkJoinPairs;
    /**
     * Check if workflow would create a valid execution path
     */
    static isExecutable(workflow: Workflow): boolean;
    /**
     * Get validation warnings only
     */
    static getWarnings(workflow: Workflow): ValidationError[];
    /**
     * Get validation errors only
     */
    static getErrors(workflow: Workflow): ValidationError[];
}
