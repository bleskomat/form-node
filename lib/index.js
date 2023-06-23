const assert = require('assert');
const ValidationError = require('./ValidationError');

const Form = function(options) {
	this.options = Object.assign({
		id: 'form',
		action: '',
		groups: [],
		help: '',
		helpHtml: '',
		instructions: '',
		instructionsHtml: '',
		method: 'post',
		process: null,
		// buttons: [
		// 	{ label: 'Cancel', href: '/', className: 'cancel' },
		// 	{ label: 'Submit', className: 'submit' },
		// ],
		submit: 'Submit',
		validate: null,
	}, options || {});
	if (this.options.process) {
		assert.strictEqual(typeof this.options.process, 'function', 'Invalid option ("process"): Function expected');
	}
	if (this.options.validate) {
		assert.strictEqual(typeof this.options.validate, 'function', 'Invalid option ("validate"): Function expected');
	}
	this.inputs = this.prepareInputs(this.options.groups);
};

Form.ValidationError = ValidationError;
Form.handlebars = require('./handlebars');

Form.prototype.prepareInputs = function(groups) {
	groups = groups || [];
	return Array.prototype.concat.apply([], groups.map(group => group.inputs));
};

Form.prototype.validate = function(data) {
	return Promise.all(this.inputs.map(input => {
		try {
			const { name } = input;
			const label = input.label || name;
			let value = data[name];
			if (!value) {
				let required = false;
				if (typeof input.required === 'function') {
					required = input.required(data) === true;
				} else {
					required = input.required === true;
				}
				assert.ok(!required, new ValidationError(`"${label}" is required`));
			} else {
				switch (input.type) {
					case 'select':
						input.options = typeof input.options === 'function' ? input.options.call(input) : input.options;
						const exists = !!input.options.find(option => option.key === value);
						assert.ok(exists, new ValidationError(`Unknown option selected for "${label}"`));
						break;
				}
			}
			if (input.validate) {
				// Prevent mutation of data object by deep-cloning before passing into validate method.
				const promise = input.validate(value, this.deepClone(data));
				if (promise instanceof Promise) {
					return promise;
				}
			}
		} catch (error) {
			return Promise.reject(error);
		}
		return Promise.resolve();
	})).then(() => {
		if (this.options.validate) {
			return this.options.validate(data);
		}
	}).then(() => {
		return this.process(data);
	});
};

Form.prototype.deepClone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

Form.prototype.process = function(data) {
	data = data || {};
	let values = {};
	this.inputs.forEach(input => {
		const { name } = input;
		let value = data[name];
		if (!value && typeof input.default !== 'undefined') {
			value = input.default;
		}
		if (input.process) {
			value = input.process(value);
		}
		switch (input.type) {
			case 'checkbox':
				value = !!value;
				break;
		}
		values[name] = value;
	});
	if (this.options.process) {
		values = this.options.process(values);
	}
	return values;
};

const normalizeClassName = Form.normalizeClassName = function(className) {
	return className.replace(/[ _\[]/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
};

// Prepare the form for an HTML template/view.
Form.prototype.serialize = function(options) {
	options = Object.assign({
		extend: {},
		values: {},
	}, options || {});
	const groups = this.options.groups.map((group, index) => {
		group = Object.assign({}, group);
		group.name = group.name || `group-${index}`;
		group.className = normalizeClassName(group.name);
		group.inputs = group.inputs.map(input => {
			input = Object.assign({}, input);
			const value = options.values[input.name];
			if (typeof value !== 'undefined' && value !== null) {
				input.value = value;
			} else if (!typeof input.default !== 'undefined') {
				input.value = input.default;
			}
			switch (input.type) {
				case 'checkbox':
					input.checked = !!input.value;
					break;
				case 'select':
					input.options = typeof input.options === 'function' ? input.options.call(input) : input.options;
					input.options = input.options.map(option => {
						option.selected = option.key === input.value;
						return option;
					});
					break;
			}
			if (!input.id) {
				input.id = ['form', group.name, input.name].join('-');
			}
			input.className = normalizeClassName(input.name);
			input.visible = input.visible !== false;
			['description', 'descriptionHtml'].forEach(key => {
				if (typeof input[key] === 'function') {
					input[key] = input[key](options.values);
				}
			});
			return input;
		});
		return group;
	});
	let serialized = Object.assign({}, this.options, options.extend, { groups });
	serialized.hasRequiredFields = this.inputs.some(input => {
		return input.required === true;
	});
	return serialized;
};

module.exports = Form;

