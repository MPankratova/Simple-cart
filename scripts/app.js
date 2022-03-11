let buttonCart = document.querySelector('.buttonCart');
let cart = document.querySelector('.cart');

/**
 * Метод, визуализирующий поле корзины
 */
buttonCart.addEventListener('click', function() {
    if (cart.style.display == 'flex') {
        cart.style.display = 'none';
    } else {
        cart.style.display = 'flex'
    }
})

// Берем все кнопки "в корзину" и слушаем клики по ней

let btnBuyItem = document.querySelectorAll('.btnBuyItem');
btnBuyItem.forEach( function(btn) {
    btn.addEventListener('click', function(event) {
        let id = event.target.dataset.id;
        let price = event.target.dataset.price;
        let name = event.target.dataset.name;
        cartItem.addProduct({id: id, price: price, name: name})
    })
})

// Создаем объект корзины, в которой буду содержаться добавленные продукты и методы, 
// добавляющие и удаляющие продукты, а также счетчик товара

let cartItem = {
    products: {},

    /**
     * Метод добавляет продукт в корзину
     * @param {{id: id, price: price, name: name}} product 
     */
    addProduct(product) {
        this.addProductToObject(product);
        this.renderProductInCart(product);
        this.renderTotalSum();
        this.addRemoveBtnsListeners();
    },

    /**
     * Метод добавляет продукт в объект с продуктами
     * @param {id: string, price: string, name: string} product 
     */
    addProductToObject(product) {
        if(this.products[product.id] == undefined) {
            this.products[product.id] = {
                price: product.price,
                name: product.name,
                count: 1
            }
        } else {
            this.products[product.id].count++;
        }
    },

    /**
     * Метод отрисовывает товар в корзине и назначает количество 1,
     * если товар уже существует, то увеличивает количество на 1
     * @param {id: string, price: string, name: string} product 
     * @returns 
     */
    renderProductInCart(product) {
        let productExist = document.querySelector(`.productCount[data-id='${product.id}']`);
        if (productExist) {
            productExist.textContent++;
            return;
        }

        let productRow = `
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td class='productCount' data-id='${product.id}'>1</td>
                <td><i class="fas fa-trash productRemoveBtn" data-id='${product.id}'></i></td>
            </tr>     
        `
        let tbody = document.querySelector('tbody');
        tbody.insertAdjacentHTML('beforeend', productRow);
    },

    /**
     * Метод отображает общую сумму товаров в корзине
     */
    renderTotalSum() {
        document.querySelector('.total').textContent = this.getTotalSum();
    },

    /**
     * Метод, считает стоимость всех товаров в корзине
     * @returns {number}
     */
    getTotalSum() {
        let sum = 0;
        for (let key in this.products) {
            sum += this.products[key].price * this.products[key].count;
        }
        return sum;
    },

    /**
     * Добавляем слушаетль событя клика на все кнопки "удалить"
     */
    addRemoveBtnsListeners() {
        let btns = document.querySelectorAll('.productRemoveBtn');
        for( let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', this.removeProductListener)
        }
    },

    /**
     * Слушатель события по кнопке "удалить"
     * @param {mouseEvent} event 
     */
    removeProductListener(event) {
        cartItem.removeProduct(event);
        cartItem.renderTotalSum();
    },

    /**
     * Метод удаляет продукт из объекта продуктов и удаляет из корзины на странице
     * @param {mouseEvent} event 
     */
    removeProduct(event) {
        let id = event.target.dataset.id;
        this.removeProductFromObject(id);
        this.removeProductFromCart(id);
    },

    /**
     * Метод удаляет продукт из объекта продуктов
     * @param {string} id 
     */
    removeProductFromObject(id) {
        if (this.products[id].count == 1) {
            delete this.products[id];
        } else {
            this.products[id].count--;
        }
    },

    /**
     * Метод удаляет продукт из корзины на странице или уменьшает количесвто на 1
     * @param {string} id 
     */
    removeProductFromCart(id) {
        let countId = document.querySelector(`.productCount[data-id='${id}']`);
        if (countId.textContent == 1) {
            countId.parentNode.remove();
        } else {
            countId.textContent--;
        }
    },
}