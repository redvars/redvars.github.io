import type { WorkflowNode, PositionedNode, SwimlaneConfig } from './types.js';
export declare class SwimlaneLayout {
    /**
     * Calculate layout positions for all nodes in a workflow
     */
    static calculateLayout(rootNode: WorkflowNode): PositionedNode[];
    /**
     * Traverse workflow tree and assign lane/depth to each node
     */
    private static _traverseAndAssignLanes;
    /**
     * Calculate SVG connector points between nodes
     */
    private static _calculateConnectors;
    /**
     * Get swimlane configurations for rendering
     */
    static getSwimlanes(positionedNodes: PositionedNode[]): SwimlaneConfig[];
    /**
     * Generate human-readable swimlane name
     */
    private static _getSwimlaneName;
    /**
     * Calculate canvas bounds for sizing
     */
    static getCanvasBounds(positionedNodes: PositionedNode[]): {
        width: number;
        height: number;
    };
}
