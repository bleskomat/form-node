module.exports = {
	action: '/some/uri/path',
	instructions: 'Instructional text about what to do with this form.',
	instructionsHtml: 'Instructional html which is <b>not escaped so use with caution</b>.',
	help: 'Help text that is displayed below the form.',
	helpHtml: 'Help html that is <b>not escaped so use with caution</b>.',
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
