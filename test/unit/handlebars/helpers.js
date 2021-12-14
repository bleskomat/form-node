const _ = require('underscore');
const { expect } = require('chai');
const Form = require('../../../');

describe('handlebars.helpers', function() {

	it('sanity check', function() {
		expect(Form.handlebars.helpers).to.be.an('object');
		_.each(Form.handlebars.helpers, helper => {
			expect(helper).to.be.a('function');
		});
	});
});
