type task = () => void;

class Scheduler {
  /**
   * information if the scheduler is active right now, is needed for recursion breaking
   */
  private processing: boolean;
  /**
   * contains the executable queue
   */
  private schedule: task[];

  /**
   * the scheduler executes its queue
   */
  constructor() {
    this.schedule = [];
    this.processing = false;
  }

  /**
   * execute the current queue
   */
  public clean() {
    this.processing = true;
    while (this.schedule.length !== 0) {
      (this.schedule.shift() as task)();
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
  public cleanWhenNotProcessing() {
    if (this.processing === false) {
      this.clean();
    }
  }

  /**
   * adds the task to the queue
   */
  public add(work: task) {
    this.schedule.push(work);

    return this;
  }
}

export default new Scheduler();
