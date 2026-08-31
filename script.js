document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       M.Z ESSENTIALS - MAIN JAVASCRIPT
    ===================================================== */

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


    /* =====================================================
       CATEGORY DATA
    ===================================================== */

    const categoryData = {

        Beauty: {
            icon: "🎀",
            title: "Beauty Collection",
            description: "Discover beautiful everyday beauty essentials, carefully selected for you."
        },

        Accessories: {
            icon: "👜",
            title: "Accessories Collection",
            description: "Cute little details that add something special to your everyday look."
        },

        Lifestyle: {
            icon: "☁️",
            title: "Lifestyle Collection",
            description: "Little lifestyle essentials made for better, easier and prettier days."
        },

        Bags: {
            icon: "👜",
            title: "Bags Collection",
            description: "Stylish and beautiful bags for every occasion."
        },

        "Hair Oil": {
            icon: "🧴",
            title: "Hair Oil Collection",
            description: "Carefully selected hair oils for your everyday hair-care routine."
        },

        Oil: {
            icon: "🧴",
            title: "Oil Collection",
            description: "Beautifully selected oils for your everyday care routine."
        }

    };


    /* =====================================================
       CART OPEN
    ===================================================== */

    function openCart() {

        if (cartSidebar) {
            cartSidebar.classList.add("active");
        }

        if (cartOverlay) {
            cartOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }


    /* =====================================================
       CART CLOSE
    ===================================================== */

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
        closeCart.addEventListener("click", closeCartPanel);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCartPanel);
    }


    /* =====================================================
       ADD TO CART
    ===================================================== */

    window.addToCart = function (productId) {

        const product = document.querySelector(
            `.product-card[data-id="${productId}"]`
        );

        if (!product) return;

        const name = product.dataset.name;
        const price = Number(product.dataset.price);

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


    /* =====================================================
       UPDATE CART
    ===================================================== */

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


        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛍️
                    </div>

                    <h3>Your bag is empty</h3>

                    <p>
                        Add something lovely to get started.
                    </p>

                </div>

            `;

            return;
        }


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


    /* =====================================================
       CHANGE QUANTITY
    ===================================================== */

    window.changeQuantity = function (productId, amount) {

        const item = cart.find(
            product =>
                String(product.id) === String(productId)
        );

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {

            cart = cart.filter(
                product =>
                    String(product.id) !== String(productId)
            );

        }

        updateCart();
    };


    /* =====================================================
       REMOVE PRODUCT
    ===================================================== */

    window.removeFromCart = function (productId) {

        cart = cart.filter(
            item =>
                String(item.id) !== String(productId)
        );

        updateCart();
    };


    /* =====================================================
       CHECKOUT
    ===================================================== */

    window.openCheckout = function () {

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first 💗"
            );

            return;
        }

        if (checkoutOverlay) {

            checkoutOverlay.classList.add("active");

        }

    };


    window.closeCheckout = function () {

        if (checkoutOverlay) {

            checkoutOverlay.classList.remove("active");

        }

    };


    /* =====================================================
       PLACE ORDER
    ===================================================== */

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (cart.length === 0) {

                    alert("Your cart is empty 💗");

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


                if (!name || !phone || !address) {

                    alert(
                        "Please complete all required details 💗"
                    );

                    return;
                }


                const order = {

                    orderId:
                        "MZ-" +
                        Date.now()
                            .toString()
                            .slice(-6),

                    customer: {

                        name: name,
                        phone: phone,
                        address: address

                    },

                    paymentMethod: payment,

                    products: cart,

                    total: cart.reduce(
                        (sum, item) =>
                            sum +
                            item.price *
                            item.quantity,
                        0
                    ),

                    date:
                        new Date().toISOString()

                };


                console.log(
                    "M.Z Essentials Order:",
                    order
                );


                alert(
                    `Thank you ${name} 💗\n\n` +
                    `Your order ${order.orderId} has been received.\n\n` +
                    `We'll contact you shortly to confirm your order.`
                );


                cart = [];

                updateCart();

                checkoutForm.reset();

                closeCheckout();

                closeCartPanel();

            }
        );

    }


    /* =====================================================
       CREATE CATEGORY PAGE
    ===================================================== */

    function createCategoryPage() {

        let categoryPage =
            document.getElementById("categoryPage");

        if (categoryPage) {

            return categoryPage;

        }


        categoryPage =
            document.createElement("section");

        categoryPage.id =
            "categoryPage";

        categoryPage.className =
            "category-page";


        categoryPage.innerHTML = `

            <div class="category-page-header">

                <button
                    class="back-button"
                    id="categoryBackButton">

                    ← Back to Home

                </button>

                <div
                    class="category-page-icon"
                    id="categoryPageIcon">
                </div>

                <h1 id="categoryPageTitle">
                    Collection
                </h1>

                <p id="categoryPageDescription">
                </p>

            </div>


            <div
                class="product-grid"
                id="categoryProductGrid">
            </div>


            <div
                class="category-empty"
                id="categoryEmpty">

                <div class="category-empty-icon">
                    🛍️
                </div>

                <h2>
                    Coming Soon
                </h2>

                <p>
                    We're adding beautiful products to this collection soon.
                </p>

            </div>

        `;


        document
            .querySelector("main")
            .appendChild(categoryPage);


        document
            .getElementById("categoryBackButton")
            .addEventListener(
                "click",
                closeCategoryPage
            );


        return categoryPage;

    }


    /* =====================================================
       OPEN CATEGORY PAGE
    ===================================================== */

    window.filterProducts = function (category) {

        const categoryPage =
            createCategoryPage();


        const products =
            document.querySelectorAll(
                ".product-card"
            );


        const categoryGrid =
            document.getElementById(
                "categoryProductGrid"
            );


        const categoryEmpty =
            document.getElementById(
                "categoryEmpty"
            );


        const categoryIcon =
            document.getElementById(
                "categoryPageIcon"
            );


        const categoryTitle =
            document.getElementById(
                "categoryPageTitle"
            );


        const categoryDescription =
            document.getElementById(
                "categoryPageDescription"
            );


        /* ---------------------------------------------
           CATEGORY INFORMATION
        --------------------------------------------- */

        const info =
            categoryData[category] || {

                icon: "✨",

                title:
                    `${category} Collection`,

                description:
                    `Explore our beautiful ${category.toLowerCase()} collection.`

            };


        categoryIcon.textContent =
            info.icon;


        categoryTitle.innerHTML =
            info.title;


        categoryDescription.textContent =
            info.description;


        /* ---------------------------------------------
           CLEAR OLD CATEGORY PRODUCTS
        --------------------------------------------- */

        categoryGrid.innerHTML = "";


        let foundProducts = 0;


        /* ---------------------------------------------
           FIND PRODUCTS
        --------------------------------------------- */

        products.forEach(product => {

            const productCategory =
                product.dataset.category
                    ?.trim()
                    .toLowerCase();


            const selectedCategory =
                category
                    .trim()
                    .toLowerCase();


            if (
                productCategory ===
                selectedCategory
            ) {

                const productClone =
                    product.cloneNode(true);


                /*
                   Fix Add button inside clone
                */

                const addButton =
                    productClone.querySelector(
                        ".add-button"
                    );


                if (addButton) {

                    const productId =
                        product.dataset.id;

                    addButton.setAttribute(
                        "onclick",
                        `addToCart('${productId}')`
                    );

                }


                categoryGrid.appendChild(
                    productClone
                );


                foundProducts++;

            }

        });


        /* ---------------------------------------------
           SHOW EMPTY MESSAGE IF NO PRODUCTS
        --------------------------------------------- */

        if (foundProducts === 0) {

            categoryEmpty.classList.add(
                "active"
            );

        } else {

            categoryEmpty.classList.remove(
                "active"
            );

        }


        /* ---------------------------------------------
           HIDE HOMEPAGE
        --------------------------------------------- */

        document.body.classList.add(
            "category-open"
        );


        /* ---------------------------------------------
           SHOW CATEGORY PAGE
        --------------------------------------------- */

        categoryPage.classList.add(
            "active"
        );


        /* ---------------------------------------------
           SCROLL TO TOP
        --------------------------------------------- */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    /* =====================================================
       CLOSE CATEGORY PAGE
    ===================================================== */

    window.closeCategoryPage =
        function () {

            const categoryPage =
                document.getElementById(
                    "categoryPage"
                );


            if (categoryPage) {

                categoryPage.classList.remove(
                    "active"
                );

            }


            document.body.classList.remove(
                "category-open"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };


    /* =====================================================
       VIEW ALL PRODUCTS
    ===================================================== */

    window.showAllProducts =
        function () {

            closeCategoryPage();

            const products =
                document.querySelectorAll(
                    "#products .product-card"
                );


            products.forEach(product => {

                product.style.display =
                    "block";

            });

        };


    /* =====================================================
       NAVIGATION
    ===================================================== */

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


                        /*
                           If category page is open,
                           close it first.
                        */

                        closeCategoryPage();


                        setTimeout(() => {

                            target.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        }, 100);

                    }

                }
            );

        });


    /* =====================================================
       NEWSLETTER
    ===================================================== */

    window.subscribeEmail =
        function () {

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


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsappButtons =
        document.querySelectorAll(
            ".whatsapp-button"
        );


    whatsappButtons.forEach(button => {

        button.href =
            "https://wa.me/923425522820";

        button.target =
            "_blank";

        button.rel =
            "noopener noreferrer";

    });


    /* =====================================================
       CHECKOUT OVERLAY CLOSE
    ===================================================== */

    if (checkoutOverlay) {

        checkoutOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    checkoutOverlay
                ) {

                    closeCheckout();

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateCart();

});
