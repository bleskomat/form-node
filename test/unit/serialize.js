const assert = require('assert');
const Form = require('../../');
const { validOptions } = require('../fixtures');

describe('serialize([options])', function() {

	const tests = [
		{
			description: 'options = {}',
			args: {
				formOptions: validOptions,
				options: {},
			},
			expected: function(serialized) {
				assert.strictEqual(typeof serialized, 'object');
				assert.strictEqual(serialized.action, validOptions.action);
				assert.ok(serialized.groups instanceof Array);
				serialized.groups.forEach(group => {
					assert.strictEqual(group.name, validOptions.groups[0].name);
					assert.ok(group.inputs instanceof Array);
					group.inputs.forEach(input => {
						assert.notStrictEqual(typeof input.id, 'undefined');
						assert.notStrictEqual(typeof input.visible, 'undefined');
					});
				});
				['help', 'helpHtml', 'instructions', 'instructionsHtml', 'method', 'buttons', 'submit'].forEach(key => {
					assert.strictEqual(serialized[key], validOptions[key], `expected serialized[${key}] to equal validOptions[${key}]`);
				});
			},
		},
		{
			description: 'options = { extend: .. }',
			args: {
				formOptions: validOptions,
				options: {
					extend: {
						action: '/changed/uri/path',
						instructions: 'Changed instructional text.',
						help: 'Different help text.',
						helpHtml: '<strong>new help html</strong>',
						submit: 'Changed Submit Label',
						method: 'put',
						groups: [],// This shouldn't override the form's groups.
					},
				},
			},
			expected: function(serialized) {
				assert.strictEqual(serialized.action, '/changed/uri/path');
				assert.strictEqual(serialized.instructions, 'Changed instructional text.');
				assert.strictEqual(serialized.help, 'Different help text.');
				assert.strictEqual(serialized.helpHtml, '<strong>new help html</strong>');
				assert.strictEqual(serialized.submit, 'Changed Submit Label');
				assert.strictEqual(serialized.method, 'put');
				assert.notStrictEqual(serialized.groups.length, 0);
			},
		},
		{
			description: 'options = { values: .. }',
			args: {
				formOptions: validOptions,
				options: {
					values: {
						field1: 'a customized value 036',
					},
				},
			},
			expected: function(serialized) {
				assert.strictEqual(serialized.groups[0].inputs[0].value, 'a customized value 036');
				assert.strictEqual(typeof serialized.groups[0].inputs[1].value, 'undefined');
			},
		},
	];

	tests.forEach(function(test) {
		it(test.description, function() {
			test.fn = function(formOptions, options) {
				const form = new Form(formOptions);
				return form.serialize(options);
			};
			return this.helpers.runTest(test);
		});
	});
});
