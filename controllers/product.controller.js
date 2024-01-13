const Product = require("../models/product.model");

const productsPage =  function(req, res) {
    Product.find()
    .then(function(products) {
    res.render("products.ejs", {products});

})
    .catch(function() {
        res.redirect("/");
    })
}

const createProductPage =  function(req, res) {
    res.render("create_products.ejs", {form: req.flash("formData")});
}

const singleProductPage = function(req, res) {
    const id = req.params.productId;
    
    Product.findById(id)
    .then(function(product) {
        res.render("single_product.ejs", {product});
    })
    .catch(function(error) {
        console.log(error);
        res.redirect("/");
    })

}

const editProductPage =  function(req, res) {
    const id = req.params.productId;
    Product.findById(id)
    .then(function(product) {
        res.render("edit_product.ejs", {product});
    })
    .catch(function() {
        res.redirect("/products/" + id);
    })
}

const createProduct = function(req, res) {
    const productData = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.image,
        category: req.body.category,
    }
    
    Product.create(productData)
    .then(function(resp) {
        res.redirect("/products/" + resp._id);
    })
    .catch(function(err) {
        req.flash("error", "Error adding product");
        req.flash("formData", req.body);
        res.redirect("/products/new");
    }) 
}

const updateProduct = function(req, res) {
    const productId = req.params.id;
    const productData = {
        name: req.body.name,
        price: req.body,price,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.image
    }
    Product.findByIdAndUpdate(productId, productData)
    .then(function(response) {
        res.redirect("/products/" + productId);
    })
    .catch(function() {
        res.redirect("/products/" + productId + "/edit");
    })
}

const deleteProduct = function(req, res) {
    const productId = req.params.id;
    Product.deleteOne({_id: productId})
    .then(function() {
        res.redirect("/products");
    })
    .catch(function() {
        res.redirect("/products/" + productId);
    })
}

module.exports = {
    productsPage,
    createProductPage,
    singleProductPage,
    editProductPage,
    createProduct,
    updateProduct,
    deleteProduct
}