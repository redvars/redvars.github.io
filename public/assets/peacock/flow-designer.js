import { _ as __decorate, I as IndividualComponent, a as i, b, A } from './IndividualComponent-Bdwyrvd6.js';
import { n } from './property-B49QQ8pS.js';
import { r } from './state-DkTK9EGF.js';
import { e } from './query-CHb9Ft_d.js';
import './toolbar.js';
import './icon-button.js';
import './icon.js';
import { c as css_248z } from './flow-designer-node-CGSm6cUH.js';
import './base-Cl6v8-BZ.js';
import './class-map-DG7CA1et.js';
import './directive-ZPhl09Yt.js';
import './if-defined-BXZpRQ4P.js';
import './when-DEJm_QN9.js';
import './is-link-Dk2OV3PM.js';
import './dispatch-event-utils-CuEqjlPT.js';
import './ButtonConstants-CahP2_NA.js';
import './hyperlink-DLvb6MXE.js';
import './throttle-C7ZAPqtu.js';
import './element-internals-2CMts_0M.js';
import './form-associated-BXADnjOB.js';
import './datasource-B2eRh6Or.js';
import './unsafe-html-Ct0N2_UU.js';

/**
 * Workflow utility functions for tree traversal and manipulation
 */
/**
 * Deep clone a workflow to ensure immutability
 */
function cloneWorkflow(workflow) {
    return JSON.parse(JSON.stringify(workflow));
}
/**
 * Deep clone a workflow node
 */
function cloneNode(node) {
    return JSON.parse(JSON.stringify(node));
}
/**
 * Find a node by ID anywhere in the workflow tree
 */
function findNodeById(node, id) {
    if (node.id === id)
        return node;
    // Search children
    if (node.children) {
        for (const child of node.children) {
            const found = findNodeById(child, id);
            if (found)
                return found;
        }
    }
    // Search tasks
    if (node.tasks) {
        for (const task of node.tasks) {
            const found = findNodeById(task, id);
            if (found)
                return found;
        }
    }
    // Search branches
    if (node.branches) {
        for (const branchNodes of Object.values(node.branches)) {
            for (const branchNode of branchNodes) {
                const found = findNodeById(branchNode, id);
                if (found)
                    return found;
            }
        }
    }
    // Search join
    if (node.join) {
        const found = findNodeById(node.join, id);
        if (found)
            return found;
    }
    return null;
}
/**
 * Remove a node by ID from the workflow tree
 */
function removeNodeById(node, id) {
    const result = cloneNode(node);
    // Remove from children
    if (result.children) {
        result.children = result.children.filter((child) => {
            if (child.id === id)
                return false;
            removeNodeById(child, id);
            return true;
        });
    }
    // Remove from tasks
    if (result.tasks) {
        result.tasks = result.tasks.filter((task) => {
            if (task.id === id)
                return false;
            removeNodeById(task, id);
            return true;
        });
    }
    // Remove from branches
    if (result.branches) {
        for (const [branchKey, branchNodes] of Object.entries(result.branches)) {
            result.branches[branchKey] = branchNodes.filter((branchNode) => {
                if (branchNode.id === id)
                    return false;
                removeNodeById(branchNode, id);
                return true;
            });
        }
    }
    // Recursively clean empty nodes
    for (const branchNode of result.children || []) {
        removeNodeById(branchNode, id);
    }
    for (const taskNode of result.tasks || []) {
        removeNodeById(taskNode, id);
    }
    for (const branchNodes of Object.values(result.branches || {})) {
        for (const branchNode of branchNodes) {
            removeNodeById(branchNode, id);
        }
    }
    return result;
}
/**
 * Insert a node into the workflow tree at a specific location
 */
function insertNodeIntoWorkflow(parent, nodeToInsert, connectionType = 'child', branchKey) {
    switch (connectionType) {
        case 'child':
            if (!parent.children)
                parent.children = [];
            parent.children.push(cloneNode(nodeToInsert));
            break;
        case 'task':
            if (!parent.tasks)
                parent.tasks = [];
            parent.tasks.push(cloneNode(nodeToInsert));
            break;
        case 'branch':
            if (!parent.branches)
                parent.branches = {};
            if (!branchKey)
                branchKey = 'default';
            if (!parent.branches[branchKey])
                parent.branches[branchKey] = [];
            parent.branches[branchKey].push(cloneNode(nodeToInsert));
            break;
    }
}
/**
 * Collect all nodes in the workflow (depth-first)
 */
function getAllNodes(node) {
    const result = [node];
    if (node.children) {
        for (const child of node.children) {
            result.push(...getAllNodes(child));
        }
    }
    if (node.tasks) {
        for (const task of node.tasks) {
            result.push(...getAllNodes(task));
        }
    }
    if (node.branches) {
        for (const branchNodes of Object.values(node.branches)) {
            for (const branchNode of branchNodes) {
                result.push(...getAllNodes(branchNode));
            }
        }
    }
    if (node.join) {
        result.push(...getAllNodes(node.join));
    }
    return result;
}
/**
 * Get all parent node IDs for a given node (path from root to node)
 */
function getNodePath(rootNode, targetId) {
    const path = [];
    function traverse(node) {
        path.push(node.id);
        if (node.id === targetId)
            return true;
        // Search children
        if (node.children) {
            for (const child of node.children) {
                if (traverse(child))
                    return true;
            }
        }
        // Search tasks
        if (node.tasks) {
            for (const task of node.tasks) {
                if (traverse(task))
                    return true;
            }
        }
        // Search branches
        if (node.branches) {
            for (const branchNodes of Object.values(node.branches)) {
                for (const branchNode of branchNodes) {
                    if (traverse(branchNode))
                        return true;
                }
            }
        }
        // Search join
        if (node.join) {
            if (traverse(node.join))
                return true;
        }
        path.pop();
        return false;
    }
    traverse(rootNode);
    return path;
}
/**
 * Check if a node is a descendant of another node
 */
function isDescendant(rootNode, potentialParentId, nodeId) {
    const path = getNodePath(rootNode, nodeId);
    return path.includes(potentialParentId);
}

/**
 * Add Node Command
 */
class AddNodeCommand {
    constructor(nodeToAdd, parentNodeId, connectionType = 'child', branchKey) {
        this.nodeToAdd = nodeToAdd;
        this.parentNodeId = parentNodeId;
        this.connectionType = connectionType;
        this.branchKey = branchKey;
        this.description = 'Add node';
    }
    execute(workflow) {
        const result = cloneWorkflow(workflow);
        const parent = findNodeById(result.nodes, this.parentNodeId);
        if (!parent)
            return workflow; // Validation in parent component
        insertNodeIntoWorkflow(parent, this.nodeToAdd, this.connectionType, this.branchKey);
        return result;
    }
    undo(workflow) {
        const result = cloneWorkflow(workflow);
        removeNodeById(result.nodes, this.nodeToAdd.id);
        return result;
    }
}
/**
 * Delete Node Command
 */
class DeleteNodeCommand {
    constructor(nodeId, workflow) {
        this.nodeId = nodeId;
        this.description = 'Delete node';
        this.deletedNode = null;
        this.parentReference = null;
        if (workflow) {
            this.captureNodeContext(workflow);
        }
    }
    captureNodeContext(workflow) {
        const node = findNodeById(workflow.nodes, this.nodeId);
        if (!node)
            return;
        this.deletedNode = cloneWorkflow({ workflow_id: '', nodes: node }).nodes;
        // Find parent reference
        this.findParentReference(workflow.nodes);
    }
    findParentReference(node) {
        if (node.children) {
            const idx = node.children.findIndex((n) => n.id === this.nodeId);
            if (idx !== -1) {
                this.parentReference = {
                    parentId: node.id,
                    connectionType: 'child',
                };
                return;
            }
            for (const child of node.children) {
                this.findParentReference(child);
            }
        }
        if (node.tasks) {
            const idx = node.tasks.findIndex((n) => n.id === this.nodeId);
            if (idx !== -1) {
                this.parentReference = {
                    parentId: node.id,
                    connectionType: 'task',
                };
                return;
            }
            for (const task of node.tasks) {
                this.findParentReference(task);
            }
        }
        if (node.branches) {
            for (const [branchKey, branchNodes] of Object.entries(node.branches)) {
                const idx = branchNodes.findIndex((n) => n.id === this.nodeId);
                if (idx !== -1) {
                    this.parentReference = {
                        parentId: node.id,
                        connectionType: 'branch',
                        branchKey,
                    };
                    return;
                }
                for (const branchNode of branchNodes) {
                    this.findParentReference(branchNode);
                }
            }
        }
    }
    execute(workflow) {
        const result = cloneWorkflow(workflow);
        removeNodeById(result.nodes, this.nodeId);
        return result;
    }
    undo(workflow) {
        if (!this.deletedNode || !this.parentReference)
            return workflow;
        const result = cloneWorkflow(workflow);
        const parent = findNodeById(result.nodes, this.parentReference.parentId);
        if (!parent)
            return workflow;
        insertNodeIntoWorkflow(parent, this.deletedNode, this.parentReference.connectionType, this.parentReference.branchKey);
        return result;
    }
}
/**
 * Edit Node Command
 */
class EditNodeCommand {
    constructor(nodeId, updates, workflow) {
        this.nodeId = nodeId;
        this.updates = updates;
        this.description = 'Edit node';
        this.previousState = {};
        if (workflow) {
            const node = findNodeById(workflow.nodes, nodeId);
            if (node) {
                // Store only edited fields
                Object.keys(updates).forEach((key) => {
                    this.previousState[key] = node[key];
                });
            }
        }
    }
    execute(workflow) {
        const result = cloneWorkflow(workflow);
        const node = findNodeById(result.nodes, this.nodeId);
        if (!node)
            return workflow;
        Object.assign(node, this.updates);
        return result;
    }
    undo(workflow) {
        const result = cloneWorkflow(workflow);
        const node = findNodeById(result.nodes, this.nodeId);
        if (!node)
            return workflow;
        Object.assign(node, this.previousState);
        return result;
    }
}
/**
 * Move Node Command - reorder in array or change parent
 */
class MoveNodeCommand {
    constructor(nodeId, newParentId, newIndex, newConnectionType = 'child', newBranchKey, workflow) {
        this.nodeId = nodeId;
        this.newParentId = newParentId;
        this.newIndex = newIndex;
        this.newConnectionType = newConnectionType;
        this.newBranchKey = newBranchKey;
        this.description = 'Move node';
        this.previousState = null;
        if (workflow) {
            this.captureCurrentPosition(workflow);
        }
    }
    captureCurrentPosition(workflow) {
        // Store current parent/position for undo
        // Implementation depends on finding current parent location
    }
    execute(workflow) {
        // Remove from old parent, insert at new parent
        let result = cloneWorkflow(workflow);
        result.nodes = removeNodeById(result.nodes, this.nodeId);
        const newParent = findNodeById(result.nodes, this.newParentId);
        if (!newParent)
            return workflow;
        const node = findNodeById(workflow.nodes, this.nodeId);
        if (!node)
            return workflow;
        insertNodeIntoWorkflow(newParent, node, this.newConnectionType, this.newBranchKey);
        return result;
    }
    undo(workflow) {
        // Restore to previous position
        if (!this.previousState)
            return workflow;
        let result = cloneWorkflow(workflow);
        result.nodes = removeNodeById(result.nodes, this.nodeId);
        const prevParent = findNodeById(result.nodes, this.previousState.parentId);
        if (!prevParent)
            return workflow;
        const node = findNodeById(workflow.nodes, this.nodeId);
        if (!node)
            return workflow;
        insertNodeIntoWorkflow(prevParent, node, this.previousState.connectionType, this.previousState.branchKey);
        return result;
    }
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 60; // Gap between depth levels (columns)
const VERTICAL_GAP = 40; // Gap between lanes
const LANE_HEIGHT = 140; // Height of each swimlane row
const LANE_HEADER_HEIGHT = 84; // Top offset so first row is not clipped by floating UI
class SwimlaneLayout {
    /**
     * Calculate layout positions for all nodes in a workflow
     */
    static calculateLayout(rootNode) {
        const layoutNodes = [];
        const lanes = new Map(); // lane -> nodes in that lane
        // First pass: assign lanes and depths
        this._traverseAndAssignLanes(rootNode, null, 'main', 0, layoutNodes, lanes);
        // Second pass: calculate positions
        const positionedNodes = [];
        const nodePositions = new Map();
        for (const layoutNode of layoutNodes) {
            const x = layoutNode.depth * (NODE_WIDTH + HORIZONTAL_GAP) + HORIZONTAL_GAP;
            const laneIndex = Array.from(lanes.keys()).indexOf(layoutNode.lane);
            const y = laneIndex * (LANE_HEIGHT + VERTICAL_GAP) + LANE_HEADER_HEIGHT;
            nodePositions.set(layoutNode.node.id, { x, y });
            const positioned = {
                node: layoutNode.node,
                x,
                y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                lane: layoutNode.lane,
                depth: layoutNode.depth,
                branchPath: layoutNode.branchPath,
                parentId: layoutNode.parent?.id,
                connectorPoints: [],
            };
            positionedNodes.push(positioned);
        }
        // Third pass: calculate connector points
        this._calculateConnectors(positionedNodes, nodePositions);
        return positionedNodes;
    }
    /**
     * Traverse workflow tree and assign lane/depth to each node
     */
    static _traverseAndAssignLanes(node, parent, baseLane, depth, layoutNodes, lanes) {
        const layoutNode = {
            node,
            parent,
            lane: baseLane,
            depth,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        };
        // Add to layout nodes
        layoutNodes.push(layoutNode);
        // Register in lanes map
        if (!lanes.has(baseLane)) {
            lanes.set(baseLane, []);
        }
        lanes.get(baseLane).push(layoutNode);
        // Process children
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                this._traverseAndAssignLanes(child, node, baseLane, depth + 1, layoutNodes, lanes);
            }
        }
        // Process decision branches into separate swimlanes
        if (node.branches) {
            let branchIndex = 0;
            for (const [branchKey, branchNodes] of Object.entries(node.branches)) {
                const branchLane = `${baseLane}_${branchKey}_${branchIndex}`;
                for (const branchNode of branchNodes) {
                    this._traverseAndAssignLanes(branchNode, node, branchLane, depth + 1, layoutNodes, lanes);
                }
                branchIndex++;
            }
        }
        // Process fork into parallel lanes
        if (node.type === 'fork' && node.tasks) {
            let taskIndex = 0;
            for (const task of node.tasks) {
                const parallelLane = `${baseLane}_parallel_${taskIndex}`;
                this._traverseAndAssignLanes(task, node, parallelLane, depth + 1, layoutNodes, lanes);
                taskIndex++;
            }
        }
        // Process fork join node
        if (node.type === 'fork' && node.join) {
            // Join node goes back to main lane at next depth
            this._traverseAndAssignLanes(node.join, node, baseLane, depth + 2, layoutNodes, lanes);
        }
        // Process task nodes (used in forks)
        if (node.tasks && node.type !== 'fork') {
            for (const task of node.tasks) {
                this._traverseAndAssignLanes(task, node, baseLane, depth + 1, layoutNodes, lanes);
            }
        }
    }
    /**
     * Calculate SVG connector points between nodes
     */
    static _calculateConnectors(positionedNodes, nodePositions) {
        const nodeMap = new Map(positionedNodes.map((n) => [n.node.id, n]));
        for (const positioned of positionedNodes) {
            const connectors = [];
            const nodeMiddleRight = {
                x: positioned.x + positioned.width,
                y: positioned.y + positioned.height / 2,
            };
            // Connect to children (sequential)
            if (positioned.node.children && positioned.node.children.length > 0) {
                for (const child of positioned.node.children) {
                    const childPos = nodeMap.get(child.id);
                    if (childPos) {
                        connectors.push({
                            from: nodeMiddleRight,
                            to: {
                                x: childPos.x,
                                y: childPos.y + childPos.height / 2,
                            },
                            type: 'straight',
                        });
                    }
                }
            }
            // Connect to branches (decision)
            if (positioned.node.branches) {
                for (const branchNodes of Object.values(positioned.node.branches)) {
                    for (const branchNode of branchNodes) {
                        const childPos = nodeMap.get(branchNode.id);
                        if (childPos) {
                            // Curved path to branch
                            connectors.push({
                                from: nodeMiddleRight,
                                to: {
                                    x: childPos.x,
                                    y: childPos.y + childPos.height / 2,
                                },
                                type: 'branch',
                            });
                        }
                    }
                }
            }
            // Connect fork to parallel tasks
            if (positioned.node.type === 'fork' && positioned.node.tasks) {
                for (const task of positioned.node.tasks) {
                    const taskPos = nodeMap.get(task.id);
                    if (taskPos) {
                        connectors.push({
                            from: nodeMiddleRight,
                            to: {
                                x: taskPos.x,
                                y: taskPos.y + taskPos.height / 2,
                            },
                            type: 'fork',
                        });
                    }
                }
            }
            // Connect to join
            if (positioned.node.type === 'fork' && positioned.node.join) {
                const joinPos = nodeMap.get(positioned.node.join.id);
                if (joinPos) {
                    connectors.push({
                        from: nodeMiddleRight,
                        to: {
                            x: joinPos.x,
                            y: joinPos.y + joinPos.height / 2,
                        },
                        type: 'join',
                    });
                }
            }
            // Connect loop back
            if (positioned.node.type === 'loop_end' && positioned.node.target_id) {
                const targetPos = nodeMap.get(positioned.node.target_id);
                if (targetPos) {
                    connectors.push({
                        from: {
                            x: positioned.x + positioned.width,
                            y: positioned.y + positioned.height / 2,
                        },
                        to: {
                            x: targetPos.x,
                            y: targetPos.y + targetPos.height / 2,
                        },
                        type: 'curved',
                    });
                }
            }
            positioned.connectorPoints = connectors;
        }
    }
    /**
     * Get swimlane configurations for rendering
     */
    static getSwimlanes(positionedNodes) {
        const swimlanesMap = new Map();
        for (const node of positionedNodes) {
            if (!swimlanesMap.has(node.lane)) {
                swimlanesMap.set(node.lane, []);
            }
            swimlanesMap.get(node.lane).push(node);
        }
        const swimlanes = [];
        for (const [laneId, nodes] of swimlanesMap.entries()) {
            const isParallel = laneId.includes('parallel');
            const name = this._getSwimlaneName(laneId);
            swimlanes.push({
                id: laneId,
                name,
                nodes,
                isParallel,
            });
        }
        return swimlanes;
    }
    /**
     * Generate human-readable swimlane name
     */
    static _getSwimlaneName(laneId) {
        if (laneId === 'main')
            return 'Main Flow';
        if (laneId.includes('yes'))
            return 'Yes Path';
        if (laneId.includes('no'))
            return 'No Path';
        if (laneId.includes('parallel')) {
            const match = laneId.match(/parallel_(\d+)/);
            if (match)
                return `Parallel Task ${parseInt(match[1]) + 1}`;
        }
        return laneId;
    }
    /**
     * Calculate canvas bounds for sizing
     */
    static getCanvasBounds(positionedNodes) {
        if (positionedNodes.length === 0) {
            return { width: 600, height: 400 };
        }
        let maxX = 0;
        let maxY = 0;
        for (const node of positionedNodes) {
            maxX = Math.max(maxX, node.x + node.width + HORIZONTAL_GAP);
            maxY = Math.max(maxY, node.y + node.height + VERTICAL_GAP);
        }
        return {
            width: Math.max(600, maxX),
            height: Math.max(400, maxY),
        };
    }
}

/**
 * Workflow validation - checks for common errors and inconsistencies
 */
class WorkflowValidator {
    /**
     * Validate entire workflow
     */
    static validate(workflow) {
        const errors = [];
        // Check root node exists and is a trigger
        if (!workflow.nodes) {
            errors.push({
                nodeId: 'root',
                type: 'orphaned_node',
                message: 'Workflow has no root node',
                severity: 'error',
            });
            return errors;
        }
        // Validate all nodes
        const allNodes = getAllNodes(workflow.nodes);
        // Check for circular loops
        errors.push(...this._checkCircularLoops(workflow.nodes, allNodes));
        // Check for orphaned nodes
        errors.push(...this._checkOrphanedNodes(workflow.nodes, allNodes));
        // Check valid branches
        errors.push(...this._checkValidBranches(workflow.nodes, allNodes));
        // Check missing targets
        errors.push(...this._checkMissingTargets(workflow, allNodes));
        // Check invalid fork/join pairs
        errors.push(...this._checkForkJoinPairs(workflow.nodes, allNodes));
        return errors;
    }
    /**
     * Detect circular loop references
     * A loop_end cannot point to a node that is its own descendant (after the loop_start)
     */
    static _checkCircularLoops(rootNode, allNodes) {
        const errors = [];
        for (const node of allNodes) {
            // Only check loop_end nodes
            if (node.type !== 'loop_end')
                continue;
            const targetId = node.target_id;
            if (!targetId)
                continue;
            // Check if target exists
            const targetNode = findNodeById(rootNode, targetId);
            if (!targetNode)
                continue;
            // If loop_end is a descendant of its target, it's circular
            if (isDescendant(rootNode, targetId, node.id)) ;
            // However, if the loop_end's target is a descendant of the loop_end, that's circular
            if (isDescendant(rootNode, node.id, targetId)) {
                errors.push({
                    nodeId: node.id,
                    type: 'circular_loop',
                    message: `Loop cannot point to a node (${targetId}) that executes after the loop_end`,
                    severity: 'error',
                });
            }
        }
        return errors;
    }
    /**
     * Check for orphaned nodes (not reachable from root)
     */
    static _checkOrphanedNodes(rootNode, allNodes) {
        const errors = [];
        const paths = new Map();
        for (const node of allNodes) {
            const path = getNodePath(rootNode, node.id);
            if (path.length === 0 && node.id !== rootNode.id) {
                errors.push({
                    nodeId: node.id,
                    type: 'orphaned_node',
                    message: `Node "${node.label}" is not reachable from the root trigger`,
                    severity: 'error',
                });
            }
            paths.set(node.id, path);
        }
        // Check nodes in branches - all branch paths must be reachable
        // This is typically valid by structure, but warn if branch has no exit
        for (const node of allNodes) {
            if (!node.branches)
                continue;
            for (const [branchKey, branchNodes] of Object.entries(node.branches)) {
                if (branchNodes.length === 0) {
                    errors.push({
                        nodeId: node.id,
                        type: 'invalid_branch',
                        message: `Branch "${branchKey}" is empty - no nodes to execute`,
                        severity: 'warning',
                    });
                }
            }
        }
        return errors;
    }
    /**
     * Check that decision nodes have valid branches
     */
    static _checkValidBranches(rootNode, allNodes) {
        const errors = [];
        for (const node of allNodes) {
            if (node.type !== 'decision')
                continue;
            if (!node.branches) {
                errors.push({
                    nodeId: node.id,
                    type: 'invalid_branch',
                    message: `Decision node "${node.label}" has no branches defined`,
                    severity: 'error',
                });
                continue;
            }
            // Standard decision should have "yes" and "no"
            const branchKeys = Object.keys(node.branches);
            if (!branchKeys.includes('yes') || !branchKeys.includes('no')) {
                errors.push({
                    nodeId: node.id,
                    type: 'invalid_branch',
                    message: `Decision node "${node.label}" should have "yes" and "no" branches`,
                    severity: 'warning',
                });
            }
            // Check for empty branches
            for (const [branchKey, branchNodes] of Object.entries(node.branches)) {
                if (branchNodes.length === 0) {
                    errors.push({
                        nodeId: node.id,
                        type: 'invalid_branch',
                        message: `Decision branch "${branchKey}" is empty`,
                        severity: 'warning',
                    });
                }
            }
        }
        return errors;
    }
    /**
     * Check that loop_end nodes reference valid loop_start nodes
     */
    static _checkMissingTargets(workflow, allNodes) {
        const errors = [];
        for (const node of allNodes) {
            if (node.type === 'loop_end') {
                if (!node.target_id) {
                    errors.push({
                        nodeId: node.id,
                        type: 'missing_target',
                        message: `Loop end "${node.label}" does not specify a target loop_start`,
                        severity: 'error',
                    });
                }
                else {
                    const target = findNodeById(workflow.nodes, node.target_id);
                    if (!target || target.type !== 'loop_start') {
                        errors.push({
                            nodeId: node.id,
                            type: 'missing_target',
                            message: `Loop end "${node.label}" references non-existent or non-loop_start node "${node.target_id}"`,
                            severity: 'error',
                        });
                    }
                }
            }
        }
        return errors;
    }
    /**
     * Check that fork nodes have corresponding join nodes
     */
    static _checkForkJoinPairs(rootNode, allNodes) {
        const errors = [];
        for (const node of allNodes) {
            if (node.type === 'fork') {
                if (!node.join) {
                    errors.push({
                        nodeId: node.id,
                        type: 'invalid_fork_join',
                        message: `Fork node "${node.label}" does not have a corresponding join node`,
                        severity: 'error',
                    });
                }
                else if (node.join.type !== 'join') {
                    errors.push({
                        nodeId: node.id,
                        type: 'invalid_fork_join',
                        message: `Fork node "${node.label}" join is not a join node`,
                        severity: 'error',
                    });
                }
                if (!node.tasks || node.tasks.length === 0) {
                    errors.push({
                        nodeId: node.id,
                        type: 'invalid_fork_join',
                        message: `Fork node "${node.label}" has no parallel tasks`,
                        severity: 'warning',
                    });
                }
            }
        }
        return errors;
    }
    /**
     * Check if workflow would create a valid execution path
     */
    static isExecutable(workflow) {
        const errors = this.validate(workflow);
        return errors.filter((e) => e.severity === 'error').length === 0;
    }
    /**
     * Get validation warnings only
     */
    static getWarnings(workflow) {
        const errors = this.validate(workflow);
        return errors.filter((e) => e.severity === 'warning');
    }
    /**
     * Get validation errors only
     */
    static getErrors(workflow) {
        const errors = this.validate(workflow);
        return errors.filter((e) => e.severity === 'error');
    }
}

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
let FlowDesigner = class FlowDesigner extends i {
    constructor() {
        super(...arguments);
        /**
         * The workflow definition to display and edit
         */
        this.workflow = { workflow_id: '', nodes: { id: 'root', type: 'trigger', label: 'Start' } };
        /**
         * Whether the flow designer is in read-only mode
         */
        this.readonly = false;
        /**
         * Whether the flow designer is disabled
         */
        this.disabled = false;
        /**
         * Show validation errors/warnings
         */
        this.showValidation = false;
        this._editor = {
            selectedNodeId: null,
            isEditing: false,
            editingNode: null,
            hoveredNodeId: null,
            isDragging: false,
            draggedNodeId: null,
            zoom: 1,
            panX: 0,
            panY: 0,
        };
        this._positionedNodes = [];
        this._history = [];
        this._historyIndex = -1;
        this._isDragScrolling = false;
        this._dragStartX = 0;
        this._dragStartY = 0;
        this._scrollStartX = 0;
        this._scrollStartY = 0;
        this._handleKeyDown = (event) => {
            if (this.disabled || this.readonly)
                return;
            if (event.ctrlKey || event.metaKey) {
                if (event.key === 'z') {
                    event.preventDefault();
                    this.undo();
                }
                else if (event.key === 'y') {
                    event.preventDefault();
                    this.redo();
                }
            }
            if (event.key === 'Delete' && this._editor.selectedNodeId) {
                event.preventDefault();
                this.deleteNode(this._editor.selectedNodeId);
            }
        };
        this._handleMouseUp = () => {
            this._isDragScrolling = false;
        };
        this._handleCanvasMouseDown = (e) => {
            if (this.disabled)
                return;
            if (e.target === this.scrollElm || e.target.classList.contains('canvas-container')) {
                this._isDragScrolling = true;
                this._dragStartX = e.clientX;
                this._dragStartY = e.clientY;
                if (this.scrollElm) {
                    this._scrollStartX = this.scrollElm.scrollLeft;
                    this._scrollStartY = this.scrollElm.scrollTop;
                }
            }
        };
        this._handleCanvasMouseMove = (e) => {
            if (!this._isDragScrolling || !this.scrollElm)
                return;
            const deltaX = e.clientX - this._dragStartX;
            const deltaY = e.clientY - this._dragStartY;
            this.scrollElm.scrollLeft = this._scrollStartX - deltaX;
            this.scrollElm.scrollTop = this._scrollStartY - deltaY;
        };
        this._handleNodeClick = (e) => {
            const nodeId = e.detail.nodeId;
            this._editor.selectedNodeId = nodeId;
            this.requestUpdate();
        };
        this._handleNodeDelete = (e) => {
            const nodeId = e.detail.nodeId;
            this.deleteNode(nodeId);
        };
        this._handleNodeEdit = (e) => {
            const nodeId = e.detail.nodeId;
            this._editor.selectedNodeId = nodeId;
            this._editor.isEditing = true;
            this.requestUpdate();
        };
        this._handleZoomIn = () => {
            this._editor.zoom = Math.min(2, this._editor.zoom + 0.1);
            this.requestUpdate();
        };
        this._handleZoomOut = () => {
            this._editor.zoom = Math.max(0.5, this._editor.zoom - 0.1);
            this.requestUpdate();
        };
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mouseup', this._handleMouseUp);
        window.addEventListener('keydown', this._handleKeyDown);
        this._recalculateLayout();
    }
    disconnectedCallback() {
        window.removeEventListener('mouseup', this._handleMouseUp);
        window.removeEventListener('keydown', this._handleKeyDown);
        super.disconnectedCallback();
    }
    willUpdate() {
        this._recalculateLayout();
    }
    /**
     * Recalculate layout when workflow changes
     */
    _recalculateLayout() {
        if (!this.workflow?.nodes)
            return;
        this._positionedNodes = SwimlaneLayout.calculateLayout(this.workflow.nodes);
    }
    /**
     * Add a new node
     */
    addNode(newNode, parentNodeId, connectionType = 'child', branchKey) {
        const command = new AddNodeCommand(newNode, parentNodeId, connectionType, branchKey);
        this._executeCommand(command);
    }
    /**
     * Delete a node by ID
     */
    deleteNode(nodeId) {
        const command = new DeleteNodeCommand(nodeId, this.workflow);
        this._executeCommand(command);
    }
    /**
     * Edit a node
     */
    editNode(nodeId, updates) {
        const command = new EditNodeCommand(nodeId, updates, this.workflow);
        this._executeCommand(command);
    }
    /**
     * Move a node to a different parent/position
     */
    moveNode(nodeId, newParentId, newIndex, connectionType = 'child', branchKey) {
        const command = new MoveNodeCommand(nodeId, newParentId, newIndex, connectionType, branchKey, this.workflow);
        this._executeCommand(command);
    }
    /**
     * Execute a command and add to history
     */
    _executeCommand(command) {
        const newWorkflow = command.execute(this.workflow);
        // Validate workflow after change
        const errors = WorkflowValidator.validate(newWorkflow);
        const hasErrors = errors.some((e) => e.severity === 'error');
        if (hasErrors && !confirm('Workflow has errors. Continue anyway?')) {
            return;
        }
        // Add to history
        this._history = this._history.slice(0, this._historyIndex + 1);
        this._history.push({
            command,
            workflow: newWorkflow,
            timestamp: Date.now(),
        });
        this._historyIndex++;
        // Update workflow
        this.workflow = newWorkflow;
        // Emit change event
        this._emitWorkflowChange('node-edited', undefined);
    }
    /**
     * Undo last operation
     */
    undo() {
        if (this._historyIndex <= 0)
            return;
        this._historyIndex--;
        const entry = this._history[this._historyIndex];
        this.workflow = cloneWorkflow(entry.workflow);
        this._emitWorkflowChange('undo', undefined);
    }
    /**
     * Redo last undone operation
     */
    redo() {
        if (this._historyIndex >= this._history.length - 1)
            return;
        this._historyIndex++;
        const entry = this._history[this._historyIndex];
        this.workflow = cloneWorkflow(entry.workflow);
        this._emitWorkflowChange('redo', undefined);
    }
    /**
     * Check if undo is available
     */
    canUndo() {
        return this._historyIndex > 0;
    }
    /**
     * Check if redo is available
     */
    canRedo() {
        return this._historyIndex < this._history.length - 1;
    }
    /**
     * Export current workflow as JSON
     */
    exportWorkflow() {
        return JSON.stringify(this.workflow, null, 2);
    }
    /**
     * Validate workflow
     */
    validate() {
        const errors = WorkflowValidator.validate(this.workflow);
        this.dispatchEvent(new CustomEvent('validation-result', {
            detail: { errors },
            bubbles: true,
            composed: true,
        }));
    }
    _emitWorkflowChange(type, nodeId) {
        this.dispatchEvent(new CustomEvent('workflow-changed', {
            detail: {
                type,
                nodeId,
                workflow: this.workflow,
            },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.workflow?.nodes) {
            return b `<div class="flow-designer-container">
        <p class="empty-state">No workflow loaded</p>
      </div>`;
        }
        const validationErrors = this.showValidation
            ? WorkflowValidator.validate(this.workflow)
            : [];
        const canvasBounds = SwimlaneLayout.getCanvasBounds(this._positionedNodes);
        return b `
      <div class="flow-designer-container">
        <wc-toolbar
          class="editor-toolbar"
          variant="floating"
          orientation="horizontal"
          elevated
        >
          <wc-icon-button
            variant="text"
            ?disabled=${this._editor.zoom <= 0.5}
            @click=${this._handleZoomOut}
            title="Zoom Out (Ctrl+-)"
          >
            <wc-icon name="remove"></wc-icon>
          </wc-icon-button>
          <span class="zoom-display">${Math.round(this._editor.zoom * 100)}%</span>
          <wc-icon-button
            variant="text"
            ?disabled=${this._editor.zoom >= 2}
            @click=${this._handleZoomIn}
            title="Zoom In (Ctrl++)"
          >
            <wc-icon name="add"></wc-icon>
          </wc-icon-button>
          <wc-icon-button
            variant="text"
            ?disabled=${!this.canUndo()}
            @click=${() => this.undo()}
            title="Undo (Ctrl+Z)"
          >
            <wc-icon name="undo"></wc-icon>
          </wc-icon-button>
          <wc-icon-button
            variant="text"
            ?disabled=${!this.canRedo()}
            @click=${() => this.redo()}
            title="Redo (Ctrl+Y)"
          >
            <wc-icon name="redo"></wc-icon>
          </wc-icon-button>
          ${!this.readonly
            ? b `
                <wc-icon-button
                  variant="text"
                  @click=${() => this.validate()}
                  title="Validate Workflow"
                >
                  <wc-icon name="check_circle"></wc-icon>
                </wc-icon-button>
              `
            : A}
        </wc-toolbar>

        <!-- Validation messages -->
        ${validationErrors.length > 0
            ? b `
              <div class="validation-panel">
                ${validationErrors.map((error) => b `
                      <div class="validation-item ${error.severity}">
                        <wc-icon
                          name=${error.severity === 'error' ? 'error' : 'warning'}
                        ></wc-icon>
                        <span>${error.message}</span>
                      </div>
                    `)}
              </div>
            `
            : A}

        <!-- Flow canvas -->
        <div
          class="flow-designer"
          @mousedown=${this._handleCanvasMouseDown}
          @mousemove=${this._handleCanvasMouseMove}
        >
          <div
            class="canvas-container"
            style="
              transform: scale(${this._editor.zoom});
              width: ${canvasBounds.width}px;
              height: ${canvasBounds.height}px;
            "
          >
            <!-- SVG Connectors -->
            <svg
              class="connectors-layer"
              width="${canvasBounds.width}"
              height="${canvasBounds.height}"
              viewBox="0 0 ${canvasBounds.width} ${canvasBounds.height}"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="currentColor"></polygon>
                </marker>
              </defs>
              ${this._renderConnectors()}
            </svg>

            <!-- Swimlane backgrounds -->
            <div class="swimlanes-container">
              ${this._renderSwimlanes()}
            </div>

            <!-- Positioned nodes -->
            <div class="nodes-layer">
              ${this._renderNodes()}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    _renderConnectors() {
        return this._positionedNodes.flatMap((node) => {
            if (!node.connectorPoints)
                return [];
            return node.connectorPoints.map((connector, idx) => {
                const { from, to, type } = connector;
                const isLoopback = type === 'curved';
                if (isLoopback) {
                    // Render curved path for loop back
                    const midY = (from.y + to.y) / 2;
                    const d = `M ${from.x} ${from.y} ` +
                        `L ${from.x + 30} ${from.y} ` +
                        `Q ${from.x + 60} ${midY} ${to.x - 30} ${to.y} ` +
                        `L ${to.x} ${to.y}`;
                    return b `
            <path
              key=${`${node.node.id}-connector-${idx}`}
              d=${d}
              class="connector ${type}"
              marker-end="url(#arrowhead)"
              vector-effect="non-scaling-stroke"
            ></path>
          `;
                }
                // Render straight connector
                const d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
                return b `
          <path
            key=${`${node.node.id}-connector-${idx}`}
            d=${d}
            class="connector ${type}"
            marker-end="url(#arrowhead)"
            vector-effect="non-scaling-stroke"
          ></path>
        `;
            });
        });
    }
    _renderSwimlanes() {
        const swimlanes = SwimlaneLayout.getSwimlanes(this._positionedNodes);
        return swimlanes.map((lane) => {
            const laneTop = Math.min(...lane.nodes.map((n) => n.y)) - 14;
            const laneBottom = Math.max(...lane.nodes.map((n) => n.y + n.height)) + 14;
            const laneHeight = Math.max(120, laneBottom - laneTop);
            return b `
          <div
            class="swimlane ${lane.isParallel ? 'parallel' : ''}"
            style="top: ${laneTop}px; height: ${laneHeight}px;"
          >
            <div class="swimlane-header">${lane.name}</div>
          </div>
        `;
        });
    }
    _renderNodes() {
        return this._positionedNodes.map((posNode) => b `
          <div
            class="positioned-node"
            style="
              left: ${posNode.x}px;
              top: ${posNode.y}px;
              width: ${posNode.width}px;
              height: ${posNode.height}px;
            "
          >
            <wc-flow-designer-node
              .node=${posNode.node}
              ?selected=${posNode.node.id === this._editor.selectedNodeId}
              ?editing=${this._editor.isEditing &&
            posNode.node.id === this._editor.selectedNodeId}
              ?disabled=${this.disabled}
              @node-click=${this._handleNodeClick}
              @node-delete=${this._handleNodeDelete}
              @node-edit-start=${this._handleNodeEdit}
            ></wc-flow-designer-node>
          </div>
        `);
    }
};
FlowDesigner.styles = [css_248z];
__decorate([
    n({ type: Object })
], FlowDesigner.prototype, "workflow", void 0);
__decorate([
    n({ type: Boolean, reflect: true, attribute: 'readonly' })
], FlowDesigner.prototype, "readonly", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], FlowDesigner.prototype, "disabled", void 0);
__decorate([
    n({ type: Boolean, attribute: 'show-validation' })
], FlowDesigner.prototype, "showValidation", void 0);
__decorate([
    r()
], FlowDesigner.prototype, "_editor", void 0);
__decorate([
    r()
], FlowDesigner.prototype, "_positionedNodes", void 0);
__decorate([
    r()
], FlowDesigner.prototype, "_history", void 0);
__decorate([
    r()
], FlowDesigner.prototype, "_historyIndex", void 0);
__decorate([
    e('.flow-designer')
], FlowDesigner.prototype, "scrollElm", void 0);
FlowDesigner = __decorate([
    IndividualComponent
], FlowDesigner);

export { FlowDesigner };
//# sourceMappingURL=flow-designer.js.map
