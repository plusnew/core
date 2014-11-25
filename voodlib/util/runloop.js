export default vood.Obj({
	jobs: [],
	ticks: 1500,
	init: function() {
		this.loop();
	},
	loop: function() {
		for(var i = 0; i < this.jobs.length; i++) {
			if(true) {
				this.jobs[i].callback();
			} else {
				try {
					this.jobs[i].callback();
				} catch(err) {
					console.log(this.jobs[i], err);
				}
			}
		}
		setTimeout(this.loop.bind(this), this.ticks);
	},
	addJob: function(job) {
		this.jobs.push(job);
	}
});