import { i, _ as __decorate, I as IndividualComponent, a as i$1, A, b } from './IndividualComponent-Bdwyrvd6.js';
import { n } from './property-B49QQ8pS.js';

var css_248z = i`* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.screen-reader-only {
  display: none !important;
}

[hidden] {
  display: none !important;
}

:host {
  display: block;
  --flow-designer-height: 600px;
  --flow-designer-border-color: var(--color-outline-variant);
  --flow-designer-background: var(--color-surface);
  --flow-designer-border-radius: var(--shape-corner-medium);
  --flow-designer-action-bar-bg: var(--color-surface-container);
}

.flow-designer-container {
  position: relative;
  width: 100%;
  height: var(--flow-designer-height);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 6;
}
.editor-toolbar .zoom-display {
  font-size: 12px;
  color: var(--color-on-surface-variant);
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}
.editor-toolbar wc-icon-button {
  --button-container-shape: var(--shape-corner-full);
}

.validation-panel {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  top: 4.5rem;
  z-index: 5;
  background: var(--color-error-container);
  color: var(--color-on-error-container);
  padding: 0.75rem;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--shape-corner-medium);
  max-height: 120px;
  overflow-y: auto;
}
.validation-panel .validation-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.validation-panel .validation-item.error {
  color: var(--color-error);
}
.validation-panel .validation-item.warning {
  color: var(--color-warning);
}
.validation-panel .validation-item wc-icon {
  flex-shrink: 0;
  --icon-size: 18px;
}
.validation-panel .validation-item span {
  font-size: 12px;
  white-space: pre-wrap;
}
.validation-panel .validation-item:last-child {
  margin-bottom: 0;
}

.flow-designer {
  flex: 1;
  overflow: auto;
  position: relative;
  border-radius: var(--flow-designer-border-radius);
  background-color: var(--flow-designer-background);
  border: 1px solid var(--flow-designer-border-color);
  cursor: grab;
}
.flow-designer:active {
  cursor: grabbing;
}
.flow-designer .canvas-container {
  position: relative;
  min-width: 1000px;
  min-height: 600px;
  transform-origin: 0 0;
}

.connectors-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
  color: var(--color-outline-variant);
}
.connectors-layer .connector {
  fill: none;
  stroke: var(--color-outline-variant, #64748b);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.connectors-layer .connector.straight {
  stroke-dasharray: none;
}
.connectors-layer .connector.curved {
  stroke-dasharray: 5, 5;
}
.connectors-layer .connector.branch {
  stroke: var(--color-primary);
  opacity: 0.7;
}
.connectors-layer .connector.fork {
  stroke: var(--color-secondary);
  stroke-width: 2.5;
}
.connectors-layer .connector.join {
  stroke: var(--color-tertiary);
  stroke-width: 2.5;
}

marker#arrowhead polygon {
  fill: var(--color-outline-variant);
}

.swimlanes-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.swimlanes-container .swimlane {
  position: absolute;
  left: 0;
  right: 0;
  background: color-mix(in srgb, var(--color-surface-container-low) 75%, transparent);
  border-top: 1px solid var(--color-outline-variant);
  border-bottom: 1px solid var(--color-outline-variant);
  overflow: hidden;
}
.swimlanes-container .swimlane.parallel {
  border-color: var(--color-secondary);
  border-top-width: 2px;
  border-bottom-width: 2px;
}
.swimlanes-container .swimlane .swimlane-header {
  background: var(--color-surface-container);
  position: absolute;
  top: 0.5rem;
  left: 0.75rem;
  padding: 0.35rem 0.6rem;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-on-surface);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--shape-corner-medium);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 250px;
}

.nodes-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.node-card {
  position: relative;
  background: var(--color-surface-container);
  border: 2px solid var(--color-outline-variant);
  border-radius: var(--shape-corner-medium);
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 200ms ease;
  overflow: hidden;
}
.node-card .node-header {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.node-card .node-header .node-icon {
  flex-shrink: 0;
  --icon-size: 20px;
  color: var(--color-primary);
}
.node-card .node-header .node-title {
  font-weight: 500;
  font-size: 13px;
  color: var(--color-on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.node-card .node-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.node-card .node-body .node-description {
  font-size: 12px;
  color: var(--color-on-surface-variant);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.node-card .node-body .node-metadata {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
}
.node-card .node-body .node-metadata .node-type-tag {
  display: inline-block;
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  padding: 2px 6px;
  border-radius: var(--shape-corner-small);
  font-size: 11px;
  font-weight: 500;
}
.node-card .node-body .node-metadata .node-id {
  display: inline-block;
  color: var(--color-on-surface-variant);
  font-size: 11px;
  font-family: monospace;
  opacity: 0.7;
}
.node-card .node-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-outline-variant);
}
.node-card .node-actions .btn-sm {
  flex: 1;
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid var(--color-outline);
  background: var(--color-surface);
  border-radius: var(--shape-corner-small);
  cursor: pointer;
  color: var(--color-on-surface);
  transition: background 200ms ease;
}
.node-card .node-actions .btn-sm:hover {
  background: var(--color-surface-container-highest);
}
.node-card.trigger {
  border-left: 4px solid var(--color-success);
}
.node-card.trigger .node-icon {
  color: var(--color-success);
}
.node-card.action {
  border-left: 4px solid var(--color-info);
}
.node-card.action .node-icon {
  color: var(--color-info);
}
.node-card.decision {
  border-left: 4px solid var(--color-warning);
}
.node-card.decision .node-icon {
  color: var(--color-warning);
}
.node-card.loop_start, .node-card.loop_end {
  border-left: 4px solid var(--color-secondary);
}
.node-card.loop_start .node-icon, .node-card.loop_end .node-icon {
  color: var(--color-secondary);
}
.node-card.fork, .node-card.join {
  border-left: 4px solid var(--color-tertiary);
}
.node-card.fork .node-icon, .node-card.join .node-icon {
  color: var(--color-tertiary);
}
.node-card[selected] {
  border-color: var(--color-primary);
  border-width: 2px;
  box-shadow: 0 0 8px rgba(var(--color-primary-rgb), 0.3);
}
.node-card[editing] {
  background: var(--color-surface-container-highest);
  border-color: var(--color-primary);
}
.node-card:not([disabled]):hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.node-card[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.positioned-node {
  position: absolute;
  pointer-events: auto;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-on-surface-variant);
  font-size: 14px;
}

:host([disabled]) {
  pointer-events: none;
  opacity: 0.38;
}

@media (max-width: 768px) {
  .editor-toolbar {
    top: 0.5rem;
    right: 0.5rem;
  }
  .node-card {
    padding: 0.75rem;
  }
  .node-card .node-header .node-icon {
    --icon-size: 18px;
  }
  .node-card .node-header .node-title {
    font-size: 12px;
  }
  .node-card .node-body .node-description {
    font-size: 11px;
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.node-card {
  animation: slideIn 200ms ease-out;
}

@media print {
  .editor-toolbar,
  .validation-panel {
    display: none;
  }
  .flow-designer {
    border: none;
    overflow: visible;
  }
}`;

/**
 * Individual node component for flow designer
 * Renders a single workflow node with customizable slot templates
 *
 * @tag wc-flow-designer-node
 * @rawTag flow-designer-node
 * @wip true
 */
let FlowDesignerNode = class FlowDesignerNode extends i$1 {
    constructor() {
        super(...arguments);
        /**
         * The workflow node to render
         */
        this.node = { id: '', type: 'action', label: '' };
        /**
         * Whether this node is currently selected
         */
        this.isSelected = false;
        /**
         * Whether this node is in edit mode
         */
        this.isEditing = false;
        /**
         * Whether this node is disabled
         */
        this.disabled = false;
        /**
         * Whether to show the delete button
         */
        this.showDelete = true;
        this._handleClick = () => {
            this.dispatchEvent(new CustomEvent('node-click', {
                detail: { nodeId: this.node.id },
                bubbles: true,
                composed: true,
            }));
        };
        this._handleDoubleClick = () => {
            this.dispatchEvent(new CustomEvent('node-edit-start', {
                detail: { nodeId: this.node.id },
                bubbles: true,
                composed: true,
            }));
        };
        this._handleDelete = (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${this.node.label}"?`)) {
                this.dispatchEvent(new CustomEvent('node-delete', {
                    detail: { nodeId: this.node.id },
                    bubbles: true,
                    composed: true,
                }));
            }
        };
        this._handleMouseEnter = () => {
            // Node hover state handled via CSS
        };
        this._handleMouseLeave = () => {
            // Node hover state handled via CSS
        };
    }
    render() {
        const { node, isSelected, isEditing, disabled } = this;
        const nodeType = node.type || 'action';
        return b `
      <div
        class="node-card ${nodeType}"
        ?selected=${isSelected}
        ?editing=${isEditing}
        ?disabled=${disabled}
        @click=${this._handleClick}
        @dblclick=${this._handleDoubleClick}
        role="button"
        tabindex="0"
        @keydown=${(e) => {
            if (e.key === 'Enter' || e.key === ' ')
                this._handleClick();
        }}
      >
        <!-- Customizable header slot -->
        <slot name="${nodeType}-header">
          ${this._renderDefaultHeader()}
        </slot>

        <!-- Customizable body slot -->
        <slot name="${nodeType}-body">${this._renderDefaultBody()}</slot>

        <!-- Action buttons -->
        ${this.isEditing
            ? b `
              <div class="node-actions">
                <button class="btn-sm" @click=${this._handleDelete}>
                  Delete
                </button>
              </div>
            `
            : A}
      </div>
    `;
    }
    _renderDefaultHeader() {
        const { node } = this;
        const iconMap = {
            trigger: 'play-circle',
            action: 'check-circle',
            decision: 'help-circle',
            loop_start: 'repeat',
            loop_end: 'repeat',
            fork: 'git-branch',
            join: 'git-merge',
        };
        const icon = iconMap[node.type] || 'activity';
        return b `
      <div class="node-header">
        <wc-icon provider="carbon" name=${icon} class="node-icon"></wc-icon>
        <span class="node-title">${node.label}</span>
      </div>
    `;
    }
    _renderDefaultBody() {
        const { node } = this;
        return b `
      <div class="node-body">
        ${node.description
            ? b `<p class="node-description">${node.description}</p>`
            : A}
        <div class="node-metadata">
          <span class="node-type-tag">${node.type}</span>
          ${node.id ? b `<span class="node-id">${node.id}</span>` : A}
        </div>
      </div>
    `;
    }
};
FlowDesignerNode.styles = [css_248z];
__decorate([
    n({ type: Object })
], FlowDesignerNode.prototype, "node", void 0);
__decorate([
    n({ type: Boolean, reflect: true, attribute: 'selected' })
], FlowDesignerNode.prototype, "isSelected", void 0);
__decorate([
    n({ type: Boolean, reflect: true, attribute: 'editing' })
], FlowDesignerNode.prototype, "isEditing", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], FlowDesignerNode.prototype, "disabled", void 0);
__decorate([
    n({ type: Boolean, attribute: 'show-delete' })
], FlowDesignerNode.prototype, "showDelete", void 0);
FlowDesignerNode = __decorate([
    IndividualComponent
], FlowDesignerNode);

export { FlowDesignerNode as F, css_248z as c };
//# sourceMappingURL=flow-designer-node-CGSm6cUH.js.map
