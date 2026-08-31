
            cartOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }


    /* =========================
       CLOSE CART
    ========================= */

    function closeCartPanel() {

        if (cartSidebar) {
            cartSidebar.classList.remove("active");
        }

        if (cartOverlay) {
            cartOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";
    }


    if (cartButton) {
        cartButton.addEventListener("click", openCart);
    }

    if (closeCart) {
        closeCart.addEventListener(
            "click",
            closeCartPanel
        );
    }

    if (cartOverlay) {
        cartOverlay.addEventListener(
            "click",
            closeCartPanel
        );
    }


    /* =========================
       ADD TO CART
    ========================= */

    window.addToCart = function (productId) {

        const product = document.querySelector(
            `.product-card[data-id="${productId}"]`
        );

        if (!product) return;


        const name =
            product.dataset.name || "Product";

        const price =
            Number(product.dataset.price) || 0;


        const existingProduct = cart.find(
            item => String(item.id) === String(productId)
        );


        if (existingProduct) {

            existingProduct.quantity += 1;

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

        if (!cartItems) return;


        let totalItems = 0;
        let totalPrice = 0;


        cart.forEach(item => {

            totalItems += item.quantity;

            totalPrice +=
                item.price * item.quantity;

        });


        if (cartCount) {

            cartCount.textContent =
                totalItems;

        }


        if (cartTotal) {

            cartTotal.textContent =
                `PKR ${totalPrice.toLocaleString()}`;

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                `PKR ${totalPrice.toLocaleString()}`;

        }


        /* EMPTY CART */

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


        /* CART PRODUCTS */

        cartItems.innerHTML = cart.map(item => {

            return `

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

            `;

        }).join("");

    }


    /* =========================
       CHANGE QUANTITY
    ========================= */

    window.changeQuantity = function (
        productId,
        amount
    ) {

        const item = cart.find(
            product =>
                String(product.id) === String(productId)
        );


        if (!item) return;


        item.quantity += amount;


        if (item.quantity <= 0) {

            cart = cart.filter(
                product =>
                    String(product.id) !==
                    String(productId)
            );

        }


        updateCart();

    };


    /* =========================
       REMOVE PRODUCT
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


        if (checkoutOverlay) {

            checkoutOverlay.classList.add(
                "active"
            );

        }

    };


    window.closeCheckout = function () {

        if (checkoutOverlay) {

            checkoutOverlay.classList.remove(
                "active"
            );

        }

    };


    /* =========================
       PLACE ORDER → WHATSAPP
    ========================= */

    if (checkoutForm) {

        checkoutForm.addEventListener(
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
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById("customerPhone")
                        .value
                        .trim();


                const address =
                    document
                        .getElementById("customerAddress")
                        .value
                        .trim();


                const payment =
                    document
                        .getElementById("paymentMethod")
                        .value;


                if (
                    !name ||
                    !phone ||
                    !address
                ) {

                    alert(
                        "Please complete all required details 💗"
                    );

                    return;

                }


                /* =====================
                   CALCULATE TOTAL
                ===================== */

                const total = cart.reduce(
                    (sum, item) => {

                        return sum +
                            (
                                item.price *
                                item.quantity
                            );

                    },
                    0
                );


                /* =====================
                   ORDER ID
                ===================== */

                const orderId =
                    "MZ-" +
                    Date.now()
                        .toString()
                        .slice(-6);


                /* =====================
                   PRODUCT LIST
                ===================== */

                let productMessage = "";


                cart.forEach(item => {

                    productMessage +=
                        `• ${item.name} x${item.quantity} — PKR ${(
                            item.price *
                            item.quantity
                        ).toLocaleString()}\n`;

                });


                /* =====================
                   PAYMENT NAME
                ===================== */

                let paymentName =
                    "Cash on Delivery";


                if (payment === "bank") {

                    paymentName =
                        "Bank Transfer";

                }


                if (payment === "online") {

                    paymentName =
                        "Online Payment";

                }


                /* =====================
                   WHATSAPP MESSAGE
                ===================== */

                const message =

                    `🌸 *NEW ORDER — M.Z ESSENTIALS* 🌸

Order ID: ${orderId}

👤 *Customer Details*

Name: ${name}

Phone: ${phone}

Address:
${address}

💳 Payment:
${paymentName}

🛍️ *Order Details*

${productMessage}

💰 *Total: PKR ${total.toLocaleString()}*

Thank you for shopping with M.Z Essentials 💗`;


                /* =====================
                   WHATSAPP NUMBER
                ===================== */

                const whatsappNumber =
                    "923425522820";


                const whatsappURL =
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        message
                    )}`;


                /* =====================
                   OPEN WHATSAPP
                ===================== */

                window.open(
                    whatsappURL,
                    "_blank"
                );


                /* =====================
                   CLEAR CART
                ===================== */

                cart = [];

                updateCart();

                checkoutForm.reset();

                closeCheckout();

                closeCartPanel();

            }
        );

    }


    /* =========================
       CATEGORY FILTER
    ========================= */

    window.filterProducts = function (
        category
    ) {

        const products =
            document.querySelectorAll(
                ".product-card"
            );


        products.forEach(product => {

            const productCategory =
                product.dataset.category;


            if (
                productCategory &&
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


        const productsSection =
            document.getElementById(
                "products"
            );


        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    };


    /* =========================
       SHOW ALL PRODUCTS
    ========================= */

    window.showAllProducts = function () {

        document
            .querySelectorAll(".product-card")
            .forEach(product => {

                product.style.display =
                    "block";

            });

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
       WHATSAPP BUTTON
    ========================= */

    const whatsappButton =
        document.getElementById(
            "whatsappButton"
        );


    if (whatsappButton) {

        whatsappButton.href =
            "https://wa.me/923425522820";

        whatsappButton.target =
            "_blank";

        whatsappButton.rel =
            "noopener noreferrer";

    }


    /* =========================
       SMOOTH NAVIGATION
    ========================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );

        });


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
            savedProducts.length === 0
        ) {

            return;

        }


        const productGrid =
            document.getElementById(
                "productGrid"
            );


        if (!productGrid) return;


        savedProducts.forEach(
            product => {

                const existingProduct =
                    productGrid.querySelector(
                        `.product-card[data-admin-id="${product.id}"]`
                    );


                if (existingProduct) {

                    return;

                }


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "product-card";


                article.dataset.category =
                    product.category;


                article.dataset.id =
                    `admin-${product.id}`;


                article.dataset.adminId =
                    product.id;


                article.dataset.name =
                    product.name;


                article.dataset.price =
                    product.price;


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
                            `<div class="product-placeholder">
                                ✿
                            </div>`
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

            }
        );

    }


    /* =========================
       INITIALIZE
    ========================= */

    loadAdminProducts();

    updateCart();

});
