describe('tests of the root object', function() {
	it('the framework should not be initialized', function() {
		expect(snew.didInit).toEqual(false)
		expect(snew.init.bind(snew)).toThrow('snew.viewHelper.entrance was not represented in dom properly null');
		expect(snew.didInit).toEqual(false);
	});
});