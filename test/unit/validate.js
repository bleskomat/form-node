const _ = require('underscore');
const { expect } = require('chai');
const Form = require('../../');
const { validOptions } = require('../fixtures');

describe('validate([values])', function() {

	const tests = [
		{
			description: 'OK',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validateOK',
								type: 'text',
								validate: function(value, data) {
									// No thrown error.
								},
							},
						],
					}],
				}),
				values: {},
			},
		},
		{
			description: 'validate(value, data)',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validateCheckArgs',
								type: 'text',
								validate: function(value, data) {
									expect(value).to.equal('testing027');
									expect(data).to.be.an('object');
									expect(data.validateCheckArgs).to.equal(value);
								},
							},
						],
					}],
				}),
				values: {
					validateCheckArgs: 'testing027',
				},
			},
		},
		{
			description: 'required missing',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'requiredField',
								type: 'text',
								required: true,
							},
						],
					}],
				}),
				values: {},
			},
			expected: function(promise) {
				return promise.then(() => {
					throw new Error('Expected validation error');
				}).catch(error => {
					expect(error.message).to.equal('"requiredField" is required');
				});
			},
		},
		{
			description: 'required has value',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'requiredField',
								type: 'text',
								required: true,
							},
						],
					}],
				}),
				values: {
					requiredField: '123',
				},
			},
		},
		{
			description: 'thrown error',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validateThrowsError',
								type: 'text',
								validate: function(value, data) {
									throw new Error('thrown inside input validate()');
								},
							},
						],
					}],
				}),
				values: {},
			},
			expected: function(promise) {
				return promise.then(() => {
					throw new Error('Expected validation error');
				}).catch(error => {
					expect(error.message).to.equal('thrown inside input validate()');
				});
			},
		},
		{
			description: 'promise resolved',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validatePromiseResolve',
								type: 'text',
								validate: function(value, data) {
									return new Promise((resolve, reject) => {
										setTimeout(resolve, 10);
									});
								},
							},
						],
					}],
				}),
				values: {},
			},
		},
		{
			description: 'promise rejected',
			args: {
				formOptions: _.extend({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validatePromiseReject',
								type: 'text',
								validate: function(value, data) {
									return new Promise((resolve, reject) => {
										setTimeout(function() {
											reject(new Error('validate() rejected promise'));
										}, 10);
									});
								},
							},
						],
					}],
				}),
				values: {},
			},
			expected: function(promise) {
				return promise.then(() => {
					throw new Error('Expected validation error');
				}).catch(error => {
					expect(error.message).to.equal('validate() rejected promise');
				});
			},
		},
	];

	_.each(tests, function(test) {
		it(test.description, function() {
			test.fn = function(formOptions, values) {
				const form = new Form(formOptions);
				return form.validate(values);
			};
			return this.helpers.runTest(test);
		});
	});
});
