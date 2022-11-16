function card() {
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
};

module.exports = card;