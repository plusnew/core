class Scheduler {
  /**
   * contains the executable queue
   */
  private schedule: (() => void)[];

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
      const work = this.schedule.shift();
      if (work !== undefined) {
        work();
      }
    }

    return this;
  }

  /**
   * adds the task to the queue
   */
  public add(work: () => void) {
    this.schedule.push(work);

    return this;
  }
}

export default new Scheduler();
