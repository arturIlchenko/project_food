function slider() {
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
		width = window.getComputedStyle(slidesWrapper).width,
		slider = document.querySelector('.offer__slider');

	let slideIndex = 1;
	let offset = 0;

	/**
	 * Устанавливаем индикатор текущего слайда в активное положение
	 */
	function setCurrentDot() {
		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	};

	/**
	 * Отображаем номер текущего слайда на странице
	 */
	function setCurrentSlide() {
		if (slideIndex < 10) {
			currentSlide.textContent = `0${slideIndex}`
		} else {
			currentSlide.textContent = slideIndex
		}
	};

	/**
	 * Убираем всё кроме чисел из строки
	 * @{param}
	 */
	function getNumbersFromString(string) {
		return +string.replace(/\D/g, '');
	};

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

	slider.style.position = 'relative';

	const navigator = document.createElement('ul'),
		dots = [];

	navigator.classList.add('carousel-indicators');

	slider.append(navigator);

	next.addEventListener('click', () => {
		if (offset == getNumbersFromString(width) * (sliders.length - 1)) {
			offset = 0
		} else {
			offset += getNumbersFromString(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == sliders.length) {
			slideIndex = 1
		} else {
			slideIndex++
		}

		setCurrentDot();

		setCurrentSlide();
	});

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = getNumbersFromString(width) * (sliders.length - 1)
		} else {
			offset -= getNumbersFromString(width);
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = sliders.length
		} else {
			slideIndex--
		}

		setCurrentDot();

		setCurrentSlide();
	});

	for (let i = 1; i < (sliders.length + 1); i++) {
		const dot = document.createElement('li');
		dot.setAttribute('dot-id', i);
		dot.classList.add('dot');
		if (i === slideIndex) {
			dot.style.opacity = 1;
		}
		navigator.append(dot);

		dots.push(dot);
	}

	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			``

			const dotIndex = e.target.getAttribute('dot-id');

			slideIndex = dotIndex;

			offset = getNumbersFromString(width) * (dotIndex - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;

			setCurrentSlide();

			setCurrentDot();
		})
	});
};

module.exports = slider;