const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Product = require("./models/product.model");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");

mongoose.connect("mongodb+srv://mixraces:052332@cluster0.jfqcz8w.mongodb.net/?retryWrites=true&w=majority")
.then(function() {
    console.log("Database connected sucessfully!");
})
.catch(function(error) {
    console.log("Error connecting to database", error.message);
});

app.use(session({secret: "GeegstackAcademy", resave: true, saveUninitialized: false}))
app.use(flash());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    res.locals.errorMsg = req.flash("error");
    res.locals.admin = req.session.adminId;
    next();
})

app.get("/", function(req, res) {
    res.render("index.ejs")
})

const productController = require("./controllers/product.controller");
const adminController = require("./controllers/admin.controller");
const adminMiddleware = require("./middleware/admin.middleware");

app.get("/products", productController.productsPage);
app.get("/products/new", adminMiddleware ,  productController.createProductPage );

app.get("/products/:productId", productController.singleProductPage );
app.get("/products/:productId/edit", adminMiddleware , productController.editProductPage);
app.post("/products", adminMiddleware , productController.createProduct );
app.put("/products/:id", adminMiddleware , productController.updateProduct);
app.delete("/products/:id", adminMiddleware , productController.deleteProduct);

app.get("/admin/register", adminController.registerPage);
app.get("/admin/login", adminController.loginPage);
app.get("/admin/profile",)
app.get("/admin/profile", adminMiddleware, adminController.adminProfile);

app.post("/admin/register", adminController.createAccount);
app.post("/admin/login", adminController.adminLogin);
app.post("/admin/logout", adminController.logout);

app.listen(2002);
