vood.Controller('main/app', {
	content: {
		title: 'Can i haz some vood?',
		list: [{foo: 'foo1'}, {foo: 'foo1'}, {foo: 'foo2'}]
	},
	init: function() {
		console.log(this.get('list.foo=foo1'));
		this.set('title', 'I want some voodz!');
	},
});