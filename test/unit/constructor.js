const _ = require('underscore');
const { expect } = require('chai');
const Form = require('../../');
const { validOptions } = require('../fixtures');

describe('constructor', function() {

	let form;
	before(function() {
		form = new Form(validOptions);
	});

	it('options as expected', function() {
		expect(form.options).to.be.an('object');
		expect(form.options.action).to.equal(validOptions.action);
		expect(form.options.groups).to.deep.equal(validOptions.groups);
		expect(form.options.help).to.equal(validOptions.help);
		expect(form.options.helpHtml).to.equal(validOptions.helpHtml);
		expect(form.options.instructions).to.equal(validOptions.instructions);
		expect(form.options.method).to.equal(validOptions.method);
		expect(form.options.submit).to.equal(validOptions.submit);
	});

	it('inputs as expected', function() {
		expect(form.inputs).to.be.an('array');
	});

	it('methods exist', function() {
		expect(form.process).to.be.a('function');
		expect(form.serialize).to.be.a('function');
		expect(form.validate).to.be.a('function');
	});
});
