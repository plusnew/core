"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scheduler {
    /**
     * the scheduler executes its queue
     */
    constructor() {
        this.schedule = [];
        this.processing = false;
    }
    /**
     * execute the current queue, mostly to trigger rerenders
     */
    clean() {
        this.processing = true;
        while (this.schedule.length !== 0) {
            this.schedule.shift()();
        }
        this.processing = false;
        return this;
    }
    /**
     * this function is for recursion breaking
     * when at a clean() a new component is created and it calls cleanWhenNotProcessing()
     * it will not again trigger clean()
     * but the loop at clean will get to the task later
     */
    cleanWhenNotProcessing() {
        if (this.processing === false) {
            this.clean();
        }
    }
    /**
     * adds the task to the queue
     */
    add(work) {
        this.schedule.push(work);
        return this;
    }
}
exports.default = new Scheduler();
//# sourceMappingURL=index.js.map