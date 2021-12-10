const _ = require('underscore');
const { expect } = require('chai');
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
				expect(serialized).to.be.an('object');
				expect(serialized.action).to.equal(validOptions.action);
				expect(serialized.groups).to.be.an('array');
				_.each(serialized.groups, group => {
					expect(group.name).to.equal(validOptions.groups[0].name);
					expect(group.inputs).to.be.an('array');
					_.each(group.inputs, input => {
						expect(input).to.have.property('id');
						expect(input).to.have.property('visible');
					});
				});
				expect(serialized.help).to.equal(validOptions.help);
				expect(serialized.helpHtml).to.equal(validOptions.helpHtml);
				expect(serialized.instructions).to.equal(validOptions.instructions);
				expect(serialized.method).to.equal(validOptions.method);
				expect(serialized.submit).to.equal(validOptions.submit);
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
				expect(serialized.action).to.equal('/changed/uri/path');
				expect(serialized.instructions).to.equal('Changed instructional text.');
				expect(serialized.help).to.equal('Different help text.');
				expect(serialized.helpHtml).to.equal('<strong>new help html</strong>');
				expect(serialized.submit).to.equal('Changed Submit Label');
				expect(serialized.method).to.equal('put');
				expect(serialized.groups).to.not.have.length(0);
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
				expect(serialized.groups[0].inputs[0].value).to.equal('a customized value 036');
				expect(serialized.groups[0].inputs[1].value).to.be.undefined;
			},
		},
	];

	_.each(tests, function(test) {
		it(test.description, function() {
			test.fn = function(formOptions, options) {
				const form = new Form(formOptions);
				return form.serialize(options);
			};
			return this.helpers.runTest(test);
		});
	});
});
