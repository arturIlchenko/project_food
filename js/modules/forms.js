function forms() {
	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо! Мы скоро с Вами свяжемся',
		failure: 'Что-то пошло не так...'
	}

	forms.forEach(element => {
		bindPostData(element);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await res.json();

	};

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.style.cssText = `
			display: block;
			margin: 0 auto;
			`;
			statusMessage.src = message.loading;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			const object = {};

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					statusMessage.remove();
					console.log(data);
					openThanksModal(message.success);
					setTimeout(() => {
						hideModalWindow();
					}, 3000)
				})
				.catch(() => openThanksModal(message.failure))
				.finally(() => form.reset());
		})
	}

	function openThanksModal(message) {
		const defaultModalWindow = document.querySelector('.modal__dialog');
		defaultModalWindow.classList.add('hide');
		showModalWindow();
		const thanksModalContainer = document.createElement('div');
		thanksModalContainer.classList.add('modal__dialog', 'show');
		thanksModalContainer.innerHTML = `
		<div class="modal__content">
			<div data-close class="modal__close">&times;</div>
			<div class="modal__title">${message}</div>
		</div>
		`;
		modalWindow.append(thanksModalContainer);
		setTimeout(() => {
			thanksModalContainer.remove();
			defaultModalWindow.classList.remove('hide');
		}, 4000)

	}
};

module.exports = forms;