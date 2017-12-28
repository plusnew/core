"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const Instance_1 = require("../Instance");
const factory_1 = require("../../factory");
const reconcile_1 = require("./reconcile");
const scheduler_1 = require("scheduler");
class ComponentInstance extends Instance_1.default {
    constructor(abstractElement, parentInstance, previousAbstractSiblingCount) {
        super(abstractElement, parentInstance, previousAbstractSiblingCount);
        this.type = types_1.default.Component;
        this.initialiseComponent()
            .handleChildren();
    }
    /**
     * calls the renderfunction with the properties and gives lifecyclehooks to the applicationcode
     */
    initialiseComponent() {
        const props = this.abstractElement.props;
        this.componentResult = this.abstractElement.type(props);
        for (const dependencyIndex in this.componentResult.dependencies) {
            const dependency = this.componentResult.dependencies[dependencyIndex];
            dependency.addOnChange(this.setDirty.bind(this));
        }
        this.dirty = false;
        return this;
    }
    /**
     * asks the component what should be changed and puts it to the factory
     */
    handleChildren() {
        const abstractChildren = this.componentResult.render(this.abstractElement.props, this.componentResult.dependencies);
        this.children = factory_1.default(abstractChildren, this, () => this.previousAbstractSiblingCount());
    }
    /**
     * sets the component to a state where it needs a rerender
     */
    setDirty() {
        if (this.dirty === false) {
            this.dirty = true;
            scheduler_1.default.add(this.update.bind(this));
            scheduler_1.default.cleanWhenNotProcessing();
        }
        return this;
    }
    /**
     * when the dirtyflag is set, unsets the dirtyflag and rerenders and informs the domhandler
     */
    update() {
        // The dirtyflag is needed, if the setDirty and the scheduler are called multiple times
        if (this.dirty === true) {
            this.dirty = false;
            reconcile_1.default(this.abstractElement, this);
        }
        return this;
    }
    getLength() {
        return this.children.getLength();
    }
    /**
     * removes the children from the dom
     */
    remove() {
        this.children.remove();
        return this;
    }
}
exports.default = ComponentInstance;
//# sourceMappingURL=Instance.js.map