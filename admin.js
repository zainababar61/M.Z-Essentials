const productForm = document.getElementById("productForm");
const productList = document.getElementById("adminProductList");

let products = JSON.parse(localStorage.getItem("mzProducts")) || [];


/* =========================
   SAVE PRODUCTS
========================= */

function saveProducts() {
    localStorage.setItem(
        "mzProducts",
        JSON.stringify(products)
    );
}


/* =========================
   DISPLAY PRODUCTS
========================= */

function displayProducts() {

    if (products.length === 0) {

        productList.innerHTML = `
            <tr>
                <td colspan="4">
                    No products added yet.
                </td>
            </tr>
        `;

        return;
    }


    productList.innerHTML = products.map((product, index) => {

        return `
            <tr>

                <td>
                    ${product.name}
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    PKR ${Number(product.price).toLocaleString()}
                </td>

                <td>

                    <div class="admin-actions">

                        <button
                            class="edit-btn"
                            onclick="editProduct(${index})">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteProduct(${index})">

                            Delete

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");
}


/* =========================
   ADD PRODUCT
========================= */

productForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("productName").value.trim();

    const price =
        document.getElementById("productPrice").value;

    const category =
        document.getElementById("productCategory").value;

    const description =
        document.getElementById("productDescription").value.trim();

    const imageInput =
        document.getElementById("productImage");


    if (!name || !price || !description) {

        alert("Please fill all required fields.");

        return;
    }


    const product = {

        id: Date.now(),

        name: name,

        price: Number(price),

        category: category,

        description: description,

        image: ""

    };


    /* Image preview/storage */

    if (
        imageInput.files &&
        imageInput.files[0]
    ) {

        const reader = new FileReader();


        reader.onload = function() {

            product.image = reader.result;

            products.push(product);

            saveProducts();

            displayProducts();

            productForm.reset();

            alert(
                "Product added successfully ✨"
            );

        };


        reader.readAsDataURL(
            imageInput.files[0]
        );

    } else {

        products.push(product);

        saveProducts();

        displayProducts();

        productForm.reset();

        alert(
            "Product added successfully ✨"
        );

    }

});


/* =========================
   DELETE PRODUCT
========================= */

window.deleteProduct = function(index) {

    const product = products[index];

    if (!product) return;


    const confirmDelete = confirm(
        `Delete "${product.name}"?`
    );


    if (!confirmDelete) return;


    products.splice(index, 1);

    saveProducts();

    displayProducts();

};


/* =========================
   EDIT PRODUCT
========================= */

window.editProduct = function(index) {

    const product = products[index];

    if (!product) return;


    document.getElementById("productName").value =
        product.name;

    document.getElementById("productPrice").value =
        product.price;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productDescription").value =
        product.description;


    products.splice(index, 1);

    saveProducts();

    displayProducts();


    document
        .getElementById("productForm")
        .scrollIntoView({
            behavior: "smooth"
        });

};


/* =========================
   INITIAL LOAD
========================= */

displayProducts();
