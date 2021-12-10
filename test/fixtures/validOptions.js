module.exports = {
	action: '/some/uri/path',
	instructions: 'Instructional text about what to do with this form.',
	help: 'Help text that is displayed below the form.',
	helpHtml: 'Help text (!! not escaped, use with caution !!) that is displayed below the form.',
	submit: 'Submit button label',
	method: 'post',
	groups: [{
		name: 'groupName1',
		inputs: [
			{
				name: 'field1',
				label: 'Field One Label',
				type: 'text',
				required: true,
				autofocus: true,
			},
			{
				name: 'field2',
				label: 'Field Two Label',
				type: 'password',
				required: true,
			},
		],
	}],
};
