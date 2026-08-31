document.addEventListener("DOMContentLoaded", function () {

    let cart = [];

    const cartButton = document.getElementById("cartButton");
    const cartCount = document.getElementById("cartCount");
    const cartSidebar = document.getElementById("cartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutOverlay = document.getElementById("checkoutOverlay");
    const checkoutForm = document.getElementById("checkoutForm");
    const productGrid = document.getElementById("productGrid");


    /* =========================
       CART OPEN / CLOSE
    ========================= */

    function openCart() {

        cartSidebar?.classList.add("active");
        cartOverlay?.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    function closeCartPanel() {

        cartSidebar?.classList.remove("active");
        cartOverlay?.classList.remove("active");

        document.body.style.overflow = "";
    }


    cartButton?.addEventListener("click", openCart);
    closeCart?.addEventListener("click", closeCartPanel);
    cartOverlay?.addEventListener("click", closeCartPanel);


    /* =========================
       ADD TO CART
    ========================= */

    window.addToCart = function (productId) {

        const product = document.querySelector(
            `.product-card[data-id="${productId}"]`
        );

        if (!product) return;

        const name = product.dataset.name;
        const price = Number(product.dataset.price);


        const existing = cart.find(
            item => String(item.id) === String(productId)
        );


        if (existing) {

            existing.quantity++;

        } else {

            cart.push({
                id: String(productId),
                name: name,
                price: price,
                quantity: 1
            });

        }


        updateCart();
        openCart();
    };


    /* =========================
       UPDATE CART
    ========================= */

    function updateCart() {

        let totalItems = 0;
        let totalPrice = 0;


        cart.forEach(item => {

            totalItems += item.quantity;

            totalPrice +=
                item.price * item.quantity;

        });


        if (cartCount) {
            cartCount.textContent = totalItems;
        }


        if (cartTotal) {
            cartTotal.textContent =
                `PKR ${totalPrice.toLocaleString()}`;
        }


        if (checkoutTotal) {
            checkoutTotal.textContent =
                `PKR ${totalPrice.toLocaleString()}`;
        }


        if (!cartItems) return;


        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛍️
                    </div>

                    <h3>
                        Your bag is empty
                    </h3>

                    <p>
                        Add something lovely to get started.
                    </p>

                </div>

            `;

            return;
        }


        cartItems.innerHTML = cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-image">
                    ✿
                </div>

                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        PKR ${item.price.toLocaleString()}
                    </p>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity('${item.id}', -1)">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity('${item.id}', 1)">
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeFromCart('${item.id}')">

                            Remove

                        </button>

                    </div>

                </div>

            </div>

        `).join("");

    }


    /* =========================
       QUANTITY
    ========================= */

    window.changeQuantity = function (
        productId,
        amount
    ) {

        const item = cart.find(
            item =>
                String(item.id) ===
                String(productId)
        );


        if (!item) return;


        item.quantity += amount;


        if (item.quantity <= 0) {

            cart = cart.filter(
                item =>
                    String(item.id) !==
                    String(productId)
            );

        }


        updateCart();
    };


    /* =========================
       REMOVE
    ========================= */

    window.removeFromCart = function (
        productId
    ) {

        cart = cart.filter(
            item =>
                String(item.id) !==
                String(productId)
        );


        updateCart();
    };


    /* =========================
       CHECKOUT
    ========================= */

    window.openCheckout = function () {

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first 💗"
            );

            return;
        }


        checkoutOverlay?.classList.add(
            "active"
        );

    };


    window.closeCheckout = function () {

        checkoutOverlay?.classList.remove(
            "active"
        );

    };


    /* =========================
       WHATSAPP ORDER
    ========================= */

    checkoutForm?.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty 💗"
                );

                return;
            }


            const name =
                document
                    .getElementById("customerName")
                    .value.trim();


            const phone =
                document
                    .getElementById("customerPhone")
                    .value.trim();


            const address =
                document
                    .getElementById("customerAddress")
                    .value.trim();


            const payment =
                document
                    .getElementById("paymentMethod")
                    .value;


            if (!name || !phone || !address) {

                alert(
                    "Please complete all required details 💗"
                );

                return;
            }


            const total = cart.reduce(
                (sum, item) =>
                    sum +
                    item.price *
                    item.quantity,
                0
            );


            const orderId =
                "MZ-" +
                Date.now()
                    .toString()
                    .slice(-6);


            let productsText = "";


            cart.forEach(item => {

                productsText +=
                    `• ${item.name} x${item.quantity} — PKR ${(
                        item.price *
                        item.quantity
                    ).toLocaleString()}\n`;

            });


            let paymentText =
                "Cash on Delivery";


            if (payment === "bank") {
                paymentText = "Bank Transfer";
            }


            if (payment === "online") {
                paymentText = "Online Payment";
            }


            const message =

`🌸 *NEW ORDER — M.Z ESSENTIALS* 🌸

Order ID: ${orderId}

👤 *Customer Details*

Name: ${name}

Phone: ${phone}

Address:
${address}

💳 Payment:
${paymentText}

🛍️ *Order Details*

${productsText}

💰 *Total: PKR ${total.toLocaleString()}*

Thank you for shopping with M.Z Essentials 💗`;


            const whatsappNumber =
                "923425522820";


            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


            window.open(
                whatsappURL,
                "_blank"
            );


            cart = [];

            updateCart();

            checkoutForm.reset();

            closeCheckout();

            closeCartPanel();

        }
    );


    /* =========================
       CATEGORY FILTER
    ========================= */

    window.filterProducts = function (
        category
    ) {

        if (!productGrid) return;


        const products =
            productGrid.querySelectorAll(
                ".product-card"
            );


        products.forEach(product => {

            const productCategory =
                product.dataset.category || "";


            if (
                productCategory.toLowerCase() ===
                category.toLowerCase()
            ) {

                product.style.display =
                    "block";

            } else {

                product.style.display =
                    "none";

            }

        });


        /* Change heading */

        const heading =
            document.querySelector(
                ".product-heading h2"
            );


        if (heading) {

            heading.textContent =
                `${category} Collection`;

        }


        const eyebrow =
            document.querySelector(
                ".product-heading .eyebrow"
            );


        if (eyebrow) {

            eyebrow.textContent =
                `SHOP ${category.toUpperCase()}`;

        }


        /* Scroll to products */

        document
            .getElementById("products")
            ?.scrollIntoView({
                behavior: "smooth"
            });

    };


    /* =========================
       VIEW ALL
    ========================= */

    window.showAllProducts = function () {

        document
            .querySelectorAll(
                ".product-card"
            )
            .forEach(product => {

                product.style.display =
                    "block";

            });


        const heading =
            document.querySelector(
                ".product-heading h2"
            );


        if (heading) {

            heading.textContent =
                "Customer Favorites";

        }


        const eyebrow =
            document.querySelector(
                ".product-heading .eyebrow"
            );


        if (eyebrow) {

            eyebrow.textContent =
                "OUR COLLECTION";

        }

    };


    /* =========================
       NEWSLETTER
    ========================= */

    window.subscribeEmail = function () {

        const input =
            document.getElementById(
                "emailInput"
            );


        if (!input) return;


        const email =
            input.value.trim();


        if (!email) {

            alert(
                "Please enter your email address 💌"
            );

            input.focus();

            return;
        }


        if (
            !email.includes("@") ||
            !email.includes(".")
        ) {

            alert(
                "Please enter a valid email address 💗"
            );

            input.focus();

            return;
        }


        alert(
            "Welcome to the M.Z Circle ✨"
        );


        input.value = "";

    };


    /* =========================
       LOAD ADMIN PRODUCTS
    ========================= */

    function loadAdminProducts() {

        const savedProducts =
            JSON.parse(
                localStorage.getItem(
                    "mzProducts"
                )
            ) || [];


        if (
            !productGrid ||
            savedProducts.length === 0
        ) {

            return;
        }


        savedProducts.forEach(product => {

            const exists =
                productGrid.querySelector(
                    `[data-admin-id="${product.id}"]`
                );


            if (exists) return;


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "product-card";


            article.dataset.id =
                `admin-${product.id}`;


            article.dataset.adminId =
                product.id;


            article.dataset.name =
                product.name;


            article.dataset.price =
                product.price;


            article.dataset.category =
                product.category;


            article.innerHTML = `

                <div class="product-image">

                    ${
                        product.image
                        ?
                        `<img
                            src="${product.image}"
                            alt="${product.name}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                            "
                        >`
                        :
                        `
                        <div class="product-placeholder">
                            ✿
                        </div>
                        `
                    }

                </div>


                <div class="product-details">

                    <p class="product-category">
                        ${product.category}
                    </p>


                    <h3>
                        ${product.name}
                    </h3>


                    <p class="product-description">
                        ${product.description}
                    </p>


                    <div class="product-bottom">

                        <strong>
                            PKR ${Number(
                                product.price
                            ).toLocaleString()}
                        </strong>


                        <button
                            class="add-button"
                            onclick="addToCart('admin-${product.id}')">

                            Add +

                        </button>

                    </div>

                </div>

            `;


            productGrid.appendChild(
                article
            );

        });

    }


    /* =========================
       START
    ========================= */

    loadAdminProducts();

    updateCart();

});
