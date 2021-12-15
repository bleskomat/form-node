const cheerio = require('cheerio');
const { expect } = require('chai');
const express = require('express');
const Form = require('../../../');
const Handlebars = require('express-handlebars');
const path = require('path');

describe('express-handlebars', function() {

	describe('basic usage', function() {

		let app, hbs;
		before(function(done) {
			app = express();
			hbs = Handlebars.create({
				extname: '.html',
				helpers: Form.handlebars.helpers,
				partialsDir: [
					Form.handlebars.partialsDir,
				],
			});
			app.engine('.html', hbs.engine);
			app.set('view engine', '.html');
			app.set('views', path.join(__dirname, 'views'));
			app.enable('view cache');
			app.get('/', function(req, res, next) {
				res.render('index', {
					title: 'Index',
					message: 'Integration test of express-handlebars',
				});
			});
			app.get('/form', function(req, res, next) {
				const form = new Form({
					groups: [
						{
							name: 'test',
							instructions: 'Integration test of the form partial w/ express-handlebars',
							inputs: [
								{
									type: 'text',
									name: 'someTextField',
									label: 'Text Field',
								},
								{
									type: 'password',
									name: 'somePasswordField',
									label: 'Password Field',
								},
								{
									type: 'select',
									options: [
										{ key: 'option1', label: 'Option 1' },
										{ key: 'option3', label: 'Option 2' },
									],
									name: 'someSelectField',
									label: 'Select Field',
								},
								{
									type: 'checkbox',
									name: 'someCheckboxField',
									label: 'Checkbox Field',
								},
								{
									type: 'hidden',
									name: 'someHiddenField',
									default: '1',
								},
							],
						},
					],
				});
				res.render('form', {
					title: 'Form partial',
					form: form.serialize(),
				});
			});
			app.server = app.listen(3000, 'localhost', done);
		});

		after(function(done) {
			if (app && app.server) return app.server.close(done);
			done();
		});

		it('basic view rendering', function() {
			return this.helpers.request('get', {
				url: 'http://localhost:3000/',
			}).then(result => {
				const { response, body } = result;
				expect(response.statusCode).to.equal(200);
				expect(body).to.contain('Integration test of express-handlebars');
			});
		});

		it('form partial', function() {
			return this.helpers.request('get', {
				url: 'http://localhost:3000/form',
			}).then(result => {
				const { response, body } = result;
				expect(response.statusCode).to.equal(200);
				expect(body).to.contain('Integration test of the form partial w/ express-handlebars');
			});
		});

		it('buttons', function() {
			const form = new Form({
				buttons: [
					{ label: 'Cancel', href: '/', className: 'cancel' },
					{ label: 'Submit', className: 'submit' },
				],
			});
			const viewPath = path.join(__dirname, 'views', 'form.html');
			return hbs.renderView(viewPath, {
				form: form.serialize(),
				layout: path.join(__dirname, 'views', 'layouts', 'main.html'),
			}).then(html => {
				const $ = cheerio.load(html);
				const $formButtons = $('.form-buttons .form-button');
				expect($formButtons).to.have.length(2);
				expect($('.form-buttons .form-button.cancel')).to.have.length(1);
				expect($('.form-buttons .form-button.submit')).to.have.length(1);
				expect($formButtons.eq(0).text()).to.equal('Cancel');
				expect($formButtons.eq(0).attr('href')).to.equal('/');
				expect($formButtons.eq(1).val()).to.equal('Submit');
			});
		});
	});
});
