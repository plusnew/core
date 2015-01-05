vood.View('main/detail', {
	events: [{
		type: '/podcasts/:id',
		action: 'changePodcast'
	}]
});
