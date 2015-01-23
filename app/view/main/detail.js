vood.View('main/detail', {
	events: [{
		type: '/podcasts/:id',
		action: 'changePodcast'
	}, {
		type: 'click',
		action: 'changeItem',
		selector: 'li'
	}]
});
