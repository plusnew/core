function Runloop() {
  this._ensureJobs()
    ._ensureInterval()
    ._ensureTick()
    ._ensureStopped();
}

Runloop.prototype = {
  _ensureJobs() {
    this._jobs = [];

    return this;
  },

  _ensureInterval() {
    this._interval = 100;

    return this;
  },

  _ensureTick() {
    this._tick = 0;

    return this;
  },

  _incrementTick() {
    this._tick++;

    return this;
  },

  _ensureStopped() {
    this._stopped = true;

    return this;
  },

  _loop() {
    this._executeJobs()
        ._incrementTick()
        ._executeTimeout();

    return this;
  },

  _executeJobs() {
    for (var i = 0; i < this._jobs.length; i++) {
      this._jobs[i].callback(this._jobs[i], this._tick);
    }

    return this;
  },

  _executeTimeout() {
    if (this._stopped !== false) {
      window.setTimeout(this._loop.bind(this), this._interval);
    }

    return this;
  },

  addJob(job) {
    this._jobs.push(job);

    return this;
  },

  stop() {
    this._stopped = true;

    return this;
  },

  start() {
    if (this._stopped === true) {
      this._stopped = false;
      this._loop();
    }

    return this;
  },
};

export default Runloop;
