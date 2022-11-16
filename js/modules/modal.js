function modal() {
	const buttonsForModal = document.querySelectorAll('[data-modal="open"]'),
		modalWindow = document.querySelector('.modal'),
		modalCloseButton = document.querySelector('.modal__close');

	function hideModalWindow() {
		modalWindow.classList.remove('show');
		modalWindow.classList.add('hide');
		document.body.style.overflow = ''
	};

	function showModalWindow() {
		modalWindow.classList.add('show');
		modalWindow.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId)
	};

	buttonsForModal.forEach(item => {
		item.addEventListener('click', showModalWindow)
	});

	modalCloseButton.addEventListener('click', hideModalWindow);

	modalWindow.addEventListener('click', (event) => {
		if (event.target === modalWindow || event.target.getAttribute('data-close') == '') {
			hideModalWindow();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.code === 'Escape' && modalWindow.classList.contains('show')) {
			hideModalWindow();
		}
	});

	const modalTimerId = setTimeout(showModalWindow, 5000);

	function showModalWindowByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
			showModalWindow();
			window.removeEventListener('scroll', showModalWindowByScroll)
		}
	};

	window.addEventListener('scroll', showModalWindowByScroll);
};

module.exports = modal;