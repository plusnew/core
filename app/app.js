vood.create({
	viewHelper: {
		entrance: '#main'
	}
});

var app = vood.Obj({
	create: function() {
		this.get('keys');
	}
});

export default app;