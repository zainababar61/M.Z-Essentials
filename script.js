document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE MENU
    ========================= */

    const nav = document.querySelector("nav");
    const navLinks = document.querySelector(".nav-links");

    if (nav && navLinks) {

        const menuButton = document.createElement("button");

        menuButton.className = "menu-button";
        menuButton.innerHTML = "☰";
        menuButton.setAttribute("aria-label", "Open menu");

        nav.insertBefore(menuButton, navLinks);

        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-active");

            menuButton.innerHTML =
                navLinks.classList.contains("mobile-active")
                    ? "✕"
                    : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("mobile-active");
                menuButton.innerHTML = "☰";
            });
        });
    }


    /* =========================
       SMOOTH SCROLLING
    ========================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

    });


    /* =========================
       SHOP NOW BUTTON
    ========================= */

    const shopButton = document.querySelector(".btn");
    const productsSection = document.querySelector("#products");

    if (shopButton && productsSection) {

        shopButton.addEventListener("click", event => {

            event.preventDefault();

            productsSection.scrollIntoView({
                behavior: "smooth"
            });

        });
    }


    /* =========================
       SHOPPING CART
    ========================= */

    let cartCount = 0;

    const cartIcon = document.querySelector(".cart");

    const productButtons =
        document.querySelectorAll(".small-btn");

    productButtons.forEach(button => {

        button.textContent = "Add to Cart";

        button.addEventListener("click", event => {

            event.preventDefault();

            cartCount++;

            if (cartIcon) {
                cartIcon.innerHTML = `🛍️ <span class="cart-count">${cartCount}</span>`;
            }

            button.textContent = "Added ✓";

            setTimeout(() => {
                button.textContent = "Add to Cart";
            }, 1500);

        });

    });


    /* =========================
       CART CLICK
    ========================= */

    if (cartIcon) {

        cartIcon.addEventListener("click", () => {

            if (cartCount === 0) {

                alert("Your cart is empty 🛍️");

            } else {

                alert(
                    `You have ${cartCount} item${cartCount > 1 ? "s" : ""} in your cart 💗`
                );

            }

        });

    }


    /* =========================
       NEWSLETTER
    ========================= */

    const emailInput =
        document.querySelector(".email-box input");

    const subscribeButton =
        document.querySelector(".email-box button");

    if (emailInput && subscribeButton) {

        subscribeButton.addEventListener("click", () => {

            const email = emailInput.value.trim();

            if (email === "") {

                alert("Please enter your email address 💌");
                emailInput.focus();
                return;

            }

            if (!email.includes("@") || !email.includes(".")) {

                alert("Please enter a valid email address 💗");
                emailInput.focus();
                return;

            }

            alert(
                "Thank you for joining the M.Z Essentials circle ✨"
            );

            emailInput.value = "";

        });

    }


    /* =========================
       SCROLL REVEAL EFFECT
    ========================= */

    const revealElements = document.querySelectorAll(
        ".category, .product, .about-content"
    );

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });


    /* =========================
       WELCOME MESSAGE
    ========================= */

    console.log(
        "✨ Welcome to M.Z Essentials"
    );

});
