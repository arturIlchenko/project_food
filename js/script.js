window.addEventListener('DOMContentLoaded', () => {

	//tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');
	function hideTabContent() {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	};

	function showTabContent(i = 0) {
		tabsContent[i].classList.remove('hide');
		tabsContent[i].classList.add('show', 'fade');
		tabs[i].classList.add('tabheader__item_active');
	};

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	})

	//timer

	const deadline = '2022-10-14';


	function getTimeRemaining(endtime) {
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());
		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
				hours = Math.floor((t / (1000 * 60 * 60)) % 24),
				minutes = Math.floor((t / 1000 / 60) % 60),
				seconds = Math.floor((t / 1000) % 60);
		};
		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	};

	function addZero(num) {
		if (num >= 0 && num <= 9) {
			return `0${num}`
		} else {
			return num
		}
	}

	function setClock(selector, secondSelector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timerInPage = document.querySelector(secondSelector),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = addZero(t.days);
			hours.innerHTML = addZero(t.hours);
			minutes.innerHTML = addZero(t.minutes);
			seconds.innerHTML = addZero(t.seconds);
			timerInPage.innerHTML = endtime;

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', '#endPromo', deadline);

	// modal

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

	// card menu

	const parentElement = document.querySelector('.menu .container');

	class Card {
		constructor(url, alt, title, text, price, curs = 59, ...classes) {
			this.url = url;
			this.alt = alt;
			this.title = title;
			this.text = text;
			this.price = price;
			this.classes = classes;
			this.usdToRub(curs)
		}
		usdToRub(curs) {
			this.price = this.price * curs
		}
		render(parent) {
			let div = document.createElement('div')
			parent.append(div);
			if (this.classes.length === 0) {
				div.classList.add('menu__item')
			} else {
				this.classes.forEach(className => div.classList.add(className));
			}
			div.innerHTML = `
		<img src=${this.url} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.text}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> руб/день</div>
					</div>`
		}
	}

	const getResource = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};

	getResource('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({ img, altimg, title, descr, price }) => {
				new Card(img, altimg, title, descr, price, 59, 'menu__item').render(parentElement)
			})
		})


	// forms 

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

	// fetch('http://localhost:3000/menu')
	// 	.then(data => data.json())
	// 	.then(data => console.log(data));

	//slider 1

	// const sliders = document.querySelectorAll('.offer__slide'),
	// 	prev = document.querySelector('.offer__slider-prev'),
	// 	next = document.querySelector('.offer__slider-next'),
	// 	currentSlide = document.querySelector('#current'),
	// 	totalSlide = document.querySelector('#total');

	// if (sliders.length < 10) {
	// 	totalSlide.textContent = `0${sliders.length}`
	// } else {
	// 	totalSlide.textContent = sliders.length
	// };

	// let slideIndex = 1;

	// function showSlide(index) {
	// 	if (index < 1) {
	// 		slideIndex = sliders.length
	// 	};

	// 	if (index > sliders.length) {
	// 		slideIndex = 1
	// 	}

	// 	sliders.forEach((slide, i) => {
	// 		if (i === slideIndex - 1) {
	// 			slide.classList.add('show', 'fade');
	// 			slide.classList.remove('hide')
	// 		} else {
	// 			slide.classList.remove('show', 'fade');
	// 			slide.classList.add('hide')
	// 		};
	// 		if (slideIndex < 10) {
	// 			currentSlide.textContent = `0${slideIndex}`
	// 		} else {
	// 			currentSlide.textContent = slideIndex
	// 		}
	// 	})
	// }

	// showSlide(slideIndex);

	// prev.addEventListener('click', () => {
	// 	slideIndex -= 1;
	// 	showSlide(slideIndex);
	// })

	// next.addEventListener('click', () => {
	// 	slideIndex += 1;
	// 	showSlide(slideIndex);
	// })

	// slider 2

	const sliders = document.querySelectorAll('.offer__slide'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		currentSlide = document.querySelector('#current'),
		totalSlide = document.querySelector('#total'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width;

		let slideIndex = 1;
		let offset = 0;

		if (sliders.length < 10) {
				totalSlide.textContent = `0${sliders.length}`;
				currentSlide.textContent = `0${slideIndex}`
			} else {
				totalSlide.textContent = sliders.length
				currentSlide.textContent = slideIndex
			};

		slidesField.style.width = 100 * sliders.length + '%';
		slidesField.style.display = 'flex';
		slidesField.style.transition = '0.5s all';

		slidesWrapper.style.overflow = 'hidden';

		sliders.forEach(slide => slide.style.width = width);

		next.addEventListener('click', () => {
			if (offset == +width.slice(0, width.length - 2) * (sliders.length - 1)) {
				offset = 0
			} else {
				offset += +width.slice(0, width.length - 2);
			}
			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slideIndex == sliders.length) {
				slideIndex = 1
			} else {
				slideIndex++
			}

			if (slideIndex < 10) {
				currentSlide.textContent = `0${slideIndex}`
			} else {
				currentSlide.textContent = slideIndex
			}
		});

		prev.addEventListener('click', () => {
			if (offset == 0) {
				offset = +width.slice(0, width.length - 2) * (sliders.length - 1)
			} else {
				offset -= +width.slice(0, width.length - 2);
			}
			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slideIndex == 1) {
				slideIndex = sliders.length
			} else {
				slideIndex--
			}

			if (slideIndex < 10) {
				currentSlide.textContent = `0${slideIndex}`
			} else {
				currentSlide.textContent = slideIndex
			}
		});
})