const _ = require('underscore');
const assert = require('assert');
const Form = require('../../../');

describe('handlebars.helpers', function() {

	it('sanity check', function() {
		assert.strictEqual(typeof Form.handlebars.helpers, 'object');
		_.each(Form.handlebars.helpers, helper => {
			assert.strictEqual(typeof helper, 'function');
		});
	});
});
