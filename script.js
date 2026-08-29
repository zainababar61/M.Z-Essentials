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


    /* =========================
       CART OPEN / CLOSE
    ========================= */

    function openCart() {
        cartSidebar.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeCartPanel() {
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
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

        const existingProduct = cart.find(
            item => item.id === productId
        );

        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({
                id: productId,
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


        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛍️</div>
                    <h3>Your bag is empty</h3>
                    <p>Add something lovely to get started.</p>
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

                        <h4>${item.name}</h4>

                        <p>
                            PKR ${item.price.toLocaleString()}
                        </p>

                        <div class="quantity-controls">

                            <button onclick="changeQuantity('${item.id}', -1)">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button onclick="changeQuantity('${item.id}', 1)">
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

    window.changeQuantity = function (productId, amount) {

        const item = cart.find(
            product => product.id === productId
        );

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {

            cart = cart.filter(
                product => product.id !== productId
            );

        }

        updateCart();
    };


    /* =========================
       REMOVE PRODUCT
    ========================= */

    window.removeFromCart = function (productId) {

        cart = cart.filter(
            item => item.id !== productId
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

        checkoutOverlay.classList.add("active");

    };


    window.closeCheckout = function () {

        checkoutOverlay.classList.remove("active");

    };


    /* =========================
       PLACE ORDER
    ========================= */

    if (checkoutForm) {

        checkoutForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (cart.length === 0) {

                alert("Your cart is empty 💗");
                return;

            }


            const name =
                document.getElementById("customerName").value.trim();

            const phone =
                document.getElementById("customerPhone").value.trim();

            const address =
                document.getElementById("customerAddress").value.trim();

            const payment =
                document.getElementById("paymentMethod").value;


            if (!name || !phone || !address) {

                alert(
                    "Please complete all required details 💗"
                );

                return;

            }


            const order = {

                orderId:
                    "MZ-" +
                    Date.now().toString().slice(-6),

                customer: {

                    name: name,
                    phone: phone,
                    address: address

                },

                paymentMethod: payment,

                products: cart,

                total: cart.reduce(
                    (sum, item) =>
                        sum + item.price * item.quantity,
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

        });

    }


    /* =========================
       CATEGORY FILTER
    ========================= */

    window.filterProducts = function (category) {

        const products =
            document.querySelectorAll(".product-card");

        products.forEach(product => {

            if (
                product.dataset.category === category
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });


        document.getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });

    };


    window.showAllProducts = function () {

        document
            .querySelectorAll(".product-card")
            .forEach(product => {

                product.style.display = "block";

            });

    };


    /* =========================
       NEWSLETTER
    ========================= */

    window.subscribeEmail = function () {

        const input =
            document.getElementById("emailInput");

        if (!input) return;

        const email = input.value.trim();


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
       WHATSAPP
    ========================= */

    const whatsappButton =
        document.getElementById("whatsappButton");
const whatsappButton =
    document.getElementById("whatsappButton");

if (whatsappButton) {

    whatsappButton.href =
        "https://wa.me/923425522820";

    whatsappButton.target = "_blank";

    whatsappButton.rel = "noopener noreferrer";

}


    /* =========================
       NAVIGATION
    ========================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        this.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(targetId);

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
       INITIALIZE
    ========================= */

    updateCart();

});

    
