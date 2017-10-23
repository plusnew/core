type task = () => void;

class Scheduler {
  /**
   * contains the executable queue
   */
  private schedule: task[];

  /**
   * the scheduler executes its queue
   */
  constructor() {
    this.schedule = [];
  }

  /**
   * execute the current queue
   */
  public clean() {
    while (this.schedule.length !== 0) {
      (this.schedule.shift() as task)();
    }

    return this;
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
