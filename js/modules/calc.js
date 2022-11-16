function calc() {
	const total = document.querySelector('.calculating__result span');

	let sex, height, weight, age, ratio;
	
		if (localStorage.getItem('sex')) {
			sex = localStorage.getItem('sex');
		} else {
			sex = 'female';
			localStorage.setItem('sex', sex);
		};

		if (localStorage.getItem('ratio')) {
			ratio = localStorage.getItem('ratio');
		} else {
			ratio = 1.375;
			localStorage.setItem('ratio', ratio);
		}

		function initLocalStorageSetings (selector, activClass) {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				element.classList.remove(activClass);
				if (element.getAttribute('id') === sex) {
					element.classList.add(activClass);
				} else if (element.getAttribute('data-ratio') == ratio) {
					element.classList.add(activClass)
				};
			})
		}

		initLocalStorageSetings ('#gender div', 'calculating__choose-item_active');
		initLocalStorageSetings ('.calculating__choose_big div', 'calculating__choose-item_active');


	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			total.textContent = '____';
			return
		};

		if (sex === 'female') {
			total.textContent = Math.round((655.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age) * ratio));
		} else {
			total.textContent = Math.round((66.5 + (13.75 * weight) + (5.003 * height) - (6.775 * age) * ratio));
		};
	};
	function getStaticParametr(selector, activClass) {
		const elements = document.querySelectorAll(selector)
		elements.forEach((element) => {
			element.addEventListener('click', (e) => {

				elements.forEach((elem) => {
					elem.classList.remove(activClass)
				});

				e.target.classList.add(activClass);
				if (e.target.getAttribute('data-ratio')) {
					ratio = e.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', e.target.getAttribute('data-ratio'))
				} else {
					sex = e.target.getAttribute('id');
					localStorage.setItem('sex', e.target.getAttribute('id'))
				};

				calcTotal();
			})
		})
	};

	function getDinamicParametr() {
		const inputs = document.querySelectorAll('.calculating__choose_medium input');
		inputs.forEach(input => {
			input.addEventListener('input', (e) => {

				if (input.value.match(/\D/g)) {
					input.style.border = '2px solid red'
				} else {
					input.style.border = 'none'
				};

				switch (e.target.getAttribute('id')) {
					case 'height':
						height = +e.target.value;
						break;
					case 'weight':
						weight = +e.target.value;
						break;
					case 'age':
						age = +e.target.value;
						break;
				}
				calcTotal();
			});
		});
	};

	getStaticParametr('#gender div', 'calculating__choose-item_active');
	getStaticParametr('.calculating__choose_big div', 'calculating__choose-item_active');
	getDinamicParametr();


	calcTotal();
};

module.exports = calc;