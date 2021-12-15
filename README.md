# form-node

Form class for node.js with validation (synchronous and asynchronous), post-processing, and support for handlebars templates.

* [Installation](#installation)
* [Usage](#usage)
* [Tests](#tests)
* [Changelog](#changelog)
* [License](#license)


## Installation

Add to your application via `npm`:
```bash
npm install samotari/form-node
```
Note that since this project is private, the installation step requires authentication with a GitHub account which has read access to this repository.

To install a specific version of this module:
```bash
npm install samotari/form-node#v1.0.0
```


## Usage

To use with [express-handlebars](https://www.npmjs.com/package/express-handlebars):
```js
const bodyParser = require('body-parser');
const express = require('express');
const Form = require('form');
const Handlebars = require('express-handlebars');
const { ValidationError } = Form;

const app = express();

const hbs = Handlebars.create({
	extname: '.html',
	helpers: _.extend({}, Form.handlebars.helpers),
	partialsDir: [
		path.join(__dirname, 'views', 'partials'),
		Form.handlebars.partialsDir,
	],
});

app.engine('.html', hbs.engine);
app.set('view engine', '.html');
app.set('views', path.join(__dirname, 'views'));
app.enable('view cache');

// Parse application/x-www-form-urlencoded:
app.use(bodyParser.urlencoded({ extended: false }));

const form = new Form({
	title: 'Form partial example',
	action: '/form',
	groups: [
		{
			name: 'login',
			inputs: [
				{
					name: 'username',
					label: 'Username',
					required: true,
					validate: function(value, data) {
						// `value` contains the value submitted for this field.
						// `data` is an object which contains all form data.
						// Perform custom validations for this field here.
						// Throw an error here to fail the validation.
						// Optionally return an instance of Promise to perform asynchronous validation.
					},
					process: function(value) {
						// `value` contains the value submitted for this field.
						// Perform custom processing for this field's value.
						return value;
					},
				},
				{
					name: 'password',
					label: 'Password',
					required: true,
				},
			],
		},
	],
});

app.get('/form', function(req, res, next) {
	res.render('form', {
		form: form.serialize(),
	});
});

app.post('/form', function(req, res, next) {
	// `req.body` is provided by the `bodyParser` middleware.
	form.validate(req.body).then(values => {
		// Validation successful.
		// `values` is an object which contains processed form data.
	}).catch(error => {
		if (error instanceof ValidationError) {
			res.status(400);
		} else {
			error = new Error('An unexpected error has occurred');
			res.status(500);
		}
		res.render('form', {
			form: form.serialize({
				errors: [ error.message ],
			}),
		});
	});
});
```


## Tests

Run automated tests as follows:
```bash
npm test
```


## Changelog

See [CHANGELOG.md](https://github.com/samotari/form-node/blob/master/CHANGELOG.md)


## License

This software is currently unlicensed, meaning it is not meant for public distribution or use. This may change at some point in the future.
