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
   PRODUCTS
========================= */

const defaultProducts = [
    {
        id: "1",
        name: "Hair Essentials",
        price: 999,
        category: "Beauty",
        description: "Everyday essentials for beautiful, healthy-looking hair.",
        image: ""
    },
    {
        id: "2",
        name: "Beauty Essential",
        price: 799,
        category: "Beauty",
        description: "A simple everyday beauty favorite.",
        image: ""
    },
    {
        id: "3",
        name: "Cute Accessory",
        price: 599,
        category: "Accessories",
        description: "A pretty little detail for your everyday look.",
        image: ""
    },
    {
        id: "4",
        name: "Daily Essential",
        price: 899,
        category: "Lifestyle",
        description: "A useful little essential for everyday life.",
        image: ""
    }
];


function getProducts() {

    const adminProducts =
        JSON.parse(localStorage.getItem("mzProducts")) || [];

    return [
        ...defaultProducts,
        ...adminProducts
    ];
}


/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts(category = "all") {

    if (!productGrid) return;

    const products = getProducts();

    const filteredProducts =
        category === "all"
            ? products
            : products.filter(
                product =>
                    product.category &&
                    product.category.toLowerCase() ===
                    category.toLowerCase()
            );


    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #80757e;
            ">
                <div style="font-size:45px;">🌸</div>
                <h3 style="
                    font-family: 'Playfair Display', serif;
                    margin: 12px 0 7px;
                ">
                    No products yet
                </h3>
                <p>
                    New ${category} products will appear here soon.
                </p>
            </div>
        `;

        return;
    }


    productGrid.innerHTML =
        filteredProducts.map(product => {

            const productId =
                String(product.id);


            const imageHTML =
                product.image
                    ? `
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            style="
                                width:100%;
                                height:100%;
                                object-fit:cover;
                            ">
                      `
                    : `
                        <div class="product-placeholder">
                            ✿
                        </div>
                      `;


            return `
                <article
                    class="product-card"
                    data-category="${product.category}"
                    data-id="${productId}"
                    data-name="${product.name}"
                    data-price="${product.price}"
                >

                    <div class="product-image">

                        ${imageHTML}

                    </div>


                    <div class="product-details">

                        <p class="product-category">
                            ${product.category}
                        </p>

                        <h3>
                            ${product.name}
                        </h3>

                        <p class="product-description">
                            ${product.description || ""}
                        </p>


                        <div class="product-bottom">

                            <strong>
                                PKR ${Number(product.price).toLocaleString()}
                            </strong>

                            <button
                                class="add-button"
                                onclick="addToCart('${productId}')"
                            >
                                Add +
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }).join("");
}


/* =========================
   CART OPEN / CLOSE
========================= */

function openCart() {

    if (!cartSidebar || !cartOverlay) return;

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeCartPanel() {

    if (!cartSidebar || !cartOverlay) return;

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


if (cartButton) {
    cartButton.addEventListener(
        "click",
        openCart
    );
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

    const product =
        document.querySelector(
            `.product-card[data-id="${productId}"]`
        );


    if (!product) return;


    const name =
        product.dataset.name;

    const price =
        Number(product.dataset.price);


    const existingProduct =
        cart.find(
            item =>
                String(item.id) ===
                String(productId)
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
            item.price *
            item.quantity;

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


    cartItems.innerHTML =
        cart.map(item => {

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
                                onclick="changeQuantity('${item.id}', -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeQuantity('${item.id}', 1)"
                            >
                                +
                            </button>

                            <button
                                class="remove-item"
                                onclick="removeFromCart('${item.id}')"
                            >
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

window.changeQuantity =
    function (productId, amount) {

        const item =
            cart.find(
                product =>
                    String(product.id) ===
                    String(productId)
            );


        if (!item) return;


        item.quantity += amount;


        if (item.quantity <= 0) {

            cart =
                cart.filter(
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

window.removeFromCart =
    function (productId) {

        cart =
            cart.filter(
                item =>
                    String(item.id) !==
                    String(productId)
            );


        updateCart();
    };


/* =========================
   CHECKOUT
========================= */

window.openCheckout =
    function () {

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


window.closeCheckout =
    function () {

        if (checkoutOverlay) {

            checkoutOverlay.classList.remove(
                "active"
            );

        }

    };


/* =========================
   PLACE ORDER
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


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum +
                        item.price *
                        item.quantity,
                    0
                );


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

                paymentMethod:
                    payment,

                products:
                    cart,

                total:
                    total,

                date:
                    new Date()
                        .toISOString()

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


/* =========================
   CATEGORY FILTER
========================= */

window.filterProducts =
    function (category) {

        displayProducts(category);


        const productsSection =
            document.getElementById(
                "products"
            );


        if (productsSection) {

            setTimeout(
                function () {

                    productsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                100
            );

        }

    };


/* =========================
   SHOW ALL PRODUCTS
========================= */

window.showAllProducts =
    function () {

        displayProducts("all");


        const productsSection =
            document.getElementById(
                "products"
            );


        if (productsSection) {

            productsSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    };


/* =========================
   NEWSLETTER
========================= */

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


/* =========================
   WHATSAPP
========================= */

const whatsappButton =
    document.querySelector(
        ".whatsapp-button"
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
   NAVIGATION
========================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        link => {

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

        }
    );


/* =========================
   INITIALIZE
========================= */

displayProducts("all");

updateCart();
