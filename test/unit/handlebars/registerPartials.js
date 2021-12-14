const _ = require('underscore');
const { expect } = require('chai');
const Form = require('../../../');

describe('handlebars.registerPartials', function() {

	it('sanity check', function() {
		// Create an isolated handlebars environment:
		const handlebars = require('handlebars').create();
		Form.handlebars.registerPartials(handlebars);
	});
});
