const _ = require('underscore');
const { expect } = require('chai');

module.exports = {
	runTest: function(test, cb) {
		if (_.isFunction(cb)) {
			throw new Error('Callback is not allowed with runTest');
		}
		return this.runFunctionTest(test);
	},
	runFunctionTest: function(test, cb) {
		if (_.isFunction(cb)) {
			throw new Error('Callback is not allowed with runFunctionTest');
		}
		let result;
		let thrownError;
		let args = _.result(test, 'args');
		if (_.isObject(args)) {
			args = _.values(args);
		}
		try {
			result = test.fn.apply(undefined, args);
		} catch (error) {
			thrownError = error;
		}
		if (!_.isUndefined(thrownError)) {
			// An error was thrown.
			if (test.expectThrownError) {
				// Check if the thrown error message matches what as expected.
				expect(thrownError.message).to.equal(test.expectThrownError);
			} else {
				// Rethrow because an error wasn't expected.
				throw thrownError;
			}
		} else if (test.expectThrownError) {
			throw new Error(`Expected error to be thrown: '${test.expectThrownError}'`);
		}
		if (!_.isUndefined(test.expected)) {
			if (_.isFunction(test.expected)) {
				// Return here because expected can return a promise.
				return test.expected.call(this, result);
			} else {
				expect(result).to.deep.equal(test.expected);
			}
		}
		return result;
	},
};
