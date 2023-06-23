const assert = require('assert');
const Form = require('../../');
const { validOptions } = require('../fixtures');

describe('validate([values])', function() {

	const tests = [
		{
			description: 'OK',
			args: {
				formOptions: Object.assign({}, validOptions, {
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
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validateCheckArgs',
								type: 'text',
								validate: function(value, data) {
									assert.strictEqual(value, 'testing027');
									assert.strictEqual(typeof data, 'object');
									assert.strictEqual(data.validateCheckArgs, value);
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
				formOptions: Object.assign({}, validOptions, {
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
					assert.strictEqual(error.message, '"requiredField" is required');
				});
			},
		},
		{
			description: 'required has value',
			args: {
				formOptions: Object.assign({}, validOptions, {
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
				formOptions: Object.assign({}, validOptions, {
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
					assert.strictEqual(error.message, 'thrown inside input validate()');
				});
			},
		},
		{
			description: 'promise resolved',
			args: {
				formOptions: Object.assign({}, validOptions, {
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
				formOptions: Object.assign({}, validOptions, {
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
					assert.strictEqual(error.message, 'validate() rejected promise');
				});
			},
		},
		{
			description: 'multiple inputs w/ promise',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'validatePromise1',
								type: 'text',
								validate: function(value, data) {
									return new Promise((resolve, reject) => {
										setTimeout(resolve, 5);
									});
								},
							},
							{
								name: 'validatePromise2',
								type: 'text',
								validate: function(value, data) {
									return new Promise((resolve, reject) => {
										setTimeout(resolve, 20);
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
			description: 'cannot mutate data object',
			args: {
				formOptions: Object.assign({}, validOptions, {
					groups: [{
						inputs: [
							{
								name: 'changeData',
								type: 'text',
								validate: function(value, data) {
									data.added = 1;
								},
							},
							{
								name: 'checkData',
								type: 'text',
								validate: function(value, data) {
									assert.strictEqual(typeof data.added, 'undefined');
								},
							},
						],
					}],
				}),
				values: {},
			},
		},
	];

	tests.forEach(function(test) {
		it(test.description, function() {
			test.fn = function(formOptions, values) {
				const form = new Form(formOptions);
				return form.validate(values);
			};
			return this.helpers.runTest(test);
		});
	});
});
