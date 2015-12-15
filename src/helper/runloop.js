import Obj from 'snew/obj/class';

export default Obj({
	////-----------------------------------------------------------------------------------------
	// Active jobs-array
	jobs: [],
	////-----------------------------------------------------------------------------------------
	// How many miliseconds should triggering the jobs
	ticks: 10,
	////-----------------------------------------------------------------------------------------
	// Gets the runloop started
	init() {
		this.loop();
	},
	////-----------------------------------------------------------------------------------------
	// Calls runloop jobs
	// @TODO call not every controller on each tick but depending on there interval
	// @TODO remove job when not needed
	loop() {
		for( let i = 0; i < this.jobs.length; i++ ){
			// @TODO use safecall
			if( true ){
				this.jobs[ i ].callback();
			} else {
				// @FIXME propably it should be not capsulated by trycatch but with a setTimeout
				try {
					this.jobs[ i ].callback();
				} catch( err ){
					console.log(this.jobs[ i ], err);
				}
			}
		}
		if( !this.stopped ){
			setTimeout(this.loop.bind( this ), this.ticks);
		}
	},
	////-----------------------------------------------------------------------------------------
	// add a job to the list
	// @TODO validation
	_addJob(job) {
		// @FIXME dont take just the callbacks, but the scope
		return this.jobs.push( job );
	},
	////-----------------------------------------------------------------------------------------
	// Stops the runloop
	stop() {
		this.stopped = true;
	},
	////-----------------------------------------------------------------------------------------
	// Starts the loop
	start() {
		this.stopped = false;
		this.loop();
	}
});