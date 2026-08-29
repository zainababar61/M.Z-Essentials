const productForm = document.getElementById("productForm");
const productList = document.getElementById("adminProductList");

let products = JSON.parse(localStorage.getItem("mzProducts")) || [];

let editingIndex = -1;


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

    if (!productList) return;

    if (products.length === 0) {

        productList.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; padding:25px;">
                    No products added yet ✨
                </td>
            </tr>
        `;

        return;
    }


    productList.innerHTML = products.map((product, index) => {

        return `
            <tr>

                <td>
                    <strong>${product.name}</strong>
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
                            type="button"
                            class="edit-btn"
                            onclick="editProduct(${index})">

                            ✏️ Edit

                        </button>

                        <button
                            type="button"
                            class="delete-btn"
                            onclick="deleteProduct(${index})">

                            🗑️ Delete

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");
}


/* =========================
   ADD / UPDATE PRODUCT
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


    const updateProduct = function(imageData) {

        const productData = {

            id:
                editingIndex >= 0
                    ? products[editingIndex].id
                    : Date.now(),

            name: name,

            price: Number(price),

            category: category,

            description: description,

            image:
                imageData ||
                (
                    editingIndex >= 0
                        ? products[editingIndex].image
                        : ""
                )

        };


        if (editingIndex >= 0) {

            products[editingIndex] = productData;

            editingIndex = -1;

            alert("Product updated successfully ✨");

        } else {

            products.push(productData);

            alert("Product added successfully ✨");

        }


        saveProducts();

        displayProducts();

        productForm.reset();

        document.querySelector(
            'button[type="submit"]'
        ).textContent = "Save Product";

    };


    if (
        imageInput.files &&
        imageInput.files[0]
    ) {

        const reader = new FileReader();

        reader.onload = function() {

            updateProduct(reader.result);

        };

        reader.readAsDataURL(
            imageInput.files[0]
        );

    } else {

        updateProduct("");

    }

});


/* =========================
   DELETE PRODUCT
========================= */

window.deleteProduct = function(index) {

    if (!products[index]) return;


    const confirmed = confirm(
        `Are you sure you want to delete "${products[index].name}"?`
    );


    if (!confirmed) return;


    products.splice(index, 1);

    saveProducts();

    displayProducts();


    alert("Product deleted successfully 🗑️");

};


/* =========================
   EDIT PRODUCT
========================= */

window.editProduct = function(index) {

    const product = products[index];

    if (!product) return;


    editingIndex = index;


    document.getElementById("productName").value =
        product.name;

    document.getElementById("productPrice").value =
        product.price;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productDescription").value =
        product.description;


    const saveButton =
        productForm.querySelector(
            'button[type="submit"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "Update Product";

    }


    productForm.scrollIntoView({
        behavior: "smooth"
    });

};


/* =========================
   INITIAL LOAD
========================= */

displayProducts();
