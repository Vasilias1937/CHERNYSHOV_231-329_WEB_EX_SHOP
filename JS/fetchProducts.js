document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=791d58e1-3359-45f5-8ec4-7350cd00e872';
    const productContainer = document.getElementById('productContainer');
    const loadMoreButton = document.getElementById('loadMore');
    const sortSelect = document.getElementById('sortSelect');

    let allProducts = []; // Array to hold all products
    let displayedProducts = 0; // Number of products currently displayed
    const productsPerLoad = 6; // Number of products to load per click

    // Function to fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allProducts = data; // Save all products to a variable
            displayProducts(); // Display the initial set of products
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            productContainer.innerHTML = '<p>Не удалось загрузить товары</p>';
        }
    }

    // Function to display products in the grid layout
    function displayProducts() {
        const productsToDisplay = allProducts.slice(displayedProducts, displayedProducts + productsPerLoad);
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" class="product-image">
                <h3 class="product-name">${product.name}</h3><br>
                <p class="product-category">${product.main_category}</p><br>
                <p class="product-rating">Рейтинг: ${product.rating}</p><br>
                <p class="product-price">Цена: <strong>${product.actual_price} ₽</strong></p><br>
                ${product.discount_price ? `<p class="product-discount-price">Цена по скидке: <strong>${product.discount_price} ₽</strong></p><br>` : ''}
                <button class="add-to-cart" data-product='${JSON.stringify(product)}'>Добавить</button>
            `;

            productContainer.appendChild(productCard);
        });

        displayedProducts += productsToDisplay.length;
        // Hide the button if all products are displayed
        if (displayedProducts >= allProducts.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }

    // Function to handle sorting of products based on selected criteria
    function sortProducts() {
        const sortValue = sortSelect.value;
        if (sortValue === 'name') {
            allProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'price') {
            allProducts.sort((a, b) => a.actual_price - b.actual_price);
        } else if (sortValue === 'rating') {
            allProducts.sort((a, b) => b.rating - a.rating);
        }

        // Reset displayed products and re-display sorted products
        displayedProducts = 0;
        productContainer.innerHTML = ''; // Clear existing products
        displayProducts(); // Display the sorted products
    }

    // Event listener for Load More button
    loadMoreButton.addEventListener('click', displayProducts);

    // Event listener for sorting dropdown
    sortSelect.addEventListener('change', sortProducts);

    // Event listener for Add to Cart button
    productContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const product = JSON.parse(event.target.getAttribute('data-product'));
            addToCart(product);
        }
    });

    // Function to add product to cart and save to localStorage
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину');
    }

    // Fetch and display products on page load
    fetchProducts();
});
