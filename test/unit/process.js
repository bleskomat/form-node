const Form = require('../../');
const { validOptions } = require('../fixtures');

describe('process([values])', function() {

	const tests = [
		{
			description: 'standard',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'someField',
								type: 'text',
							},
						],
					}],
				}),
				values: {
					someField: 'test051',
				},
			},
			expected: {
				someField: 'test051',
			},
		},
		{
			description: 'default value',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'fieldWithDefault',
								type: 'text',
								default: 'a default value',
							},
						],
					}],
				}),
				values: {},
			},
			expected: {
				fieldWithDefault: 'a default value',
			},
		},
		{
			description: 'checkbox is checked',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'checkboxField',
								type: 'checkbox',
							},
						],
					}],
				}),
				values: {
					checkboxField: '1',
				},
			},
			expected: {
				checkboxField: true,
			},
		},
		{
			description: 'checkbox is not checked',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'checkboxField',
								type: 'checkbox',
							},
						],
					}],
				}),
				values: {},
			},
			expected: {
				checkboxField: false,
			},
		},
		{
			description: 'process: function() {}',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'processedTextField',
								type: 'text',
								process: function(value) {
									return `PROCESSED: ${value}`;
								},
							},
						],
					}],
				}),
				values: {
					processedTextField: 'test759'
				},
			},
			expected: {
				processedTextField: 'PROCESSED: test759',
			},
		},
	];

	tests.forEach(function(test) {
		it(test.description, function() {
			test.fn = function(formOptions, values) {
				const form = new Form(formOptions);
				return form.process(values);
			};
			return this.helpers.runTest(test);
		});
	});
});
