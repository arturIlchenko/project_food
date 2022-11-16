window.addEventListener('DOMContentLoaded', () => {
	const calc = require('./modules/calc'),
			card = require('./modules/card'),
			forms = require('./modules/forms'),
			modal = require('./modules/modal'),
			slider = require('./modules/slider'),
			tabs = require('./modules/tabs'),
			timer = require('./modules/timer');

	calc();
	card();
	forms();
	modal();
	slider();
	tabs();
	timer();
});