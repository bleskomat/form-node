const _ = require('underscore');
const assert = require('assert');
const Form = require('../../');
const { validOptions } = require('../fixtures');

describe('constructor', function() {

	let form;
	before(function() {
		form = new Form(validOptions);
	});

	it('options as expected', function() {
		assert.strictEqual(typeof form.options, 'object');
		assert.deepStrictEqual(form.options.groups, validOptions.groups);
		['action', 'help', 'helpHtml', 'instructions', 'instructionsHtml', 'method', 'buttons', 'submit'].forEach(key => {
			assert.strictEqual(form.options[key], validOptions[key], `expected form.options[${key}] to equal validOptions[${key}]`);
		});
	});

	it('inputs as expected', function() {
		assert.ok(form.inputs instanceof Array);
	});

	it('methods exist', function() {
		assert.strictEqual(typeof form.process, 'function');
		assert.strictEqual(typeof form.serialize, 'function');
		assert.strictEqual(typeof form.validate, 'function');
	});
});
