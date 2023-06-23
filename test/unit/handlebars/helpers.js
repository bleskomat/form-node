const assert = require('assert');
const Form = require('../../../');

describe('handlebars.helpers', function() {

	it('sanity check', function() {
		assert.strictEqual(typeof Form.handlebars.helpers, 'object');
		Object.values(Form.handlebars.helpers).forEach(helper => {
			assert.strictEqual(typeof helper, 'function');
		});
	});
});
