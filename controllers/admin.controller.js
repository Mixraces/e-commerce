const Admin = require("../models/admin.models");
const bcrypt = require("bcrypt");
const Product = require("../models/product.model")

const registerPage = function(req, res) {
    res.render("admin_register.ejs", {form: req.flash("formData")});
}

const loginPage = function (req, res) {
    res.render("admin_login.ejs", {form: req.flash("formData")});
}

const createAccount = function(req, res) { 
    if (!req.body.fname || !req.body.lname || !req.body.email || !req.body.password || !req.body.cpassword) {
        req,flash("error", "All fields are required.");
        req,flash("formData", req.body);
        return res.redirect("/admin/register");
    } else if (req.body.password !== req.body.cpassword) {
        req.flash("error", "Passwords do not match.");
        req.flash("formData", req.body);
        return res.redirect("/admin/register");
    }

    Admin.findOne({email: req.body.email})
    .then(admin => {
        if (admin) {
            req.flash("error", "Admin with the same email already exists.");
            req.flash("formData", req.body);
            return res.redirect("/admin/register");
        }
const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const adminData = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        password:hashPassword
    }

Admin.create(adminData)
.then(function(resp)  {
    res.redirect("/");
})
.catch(function(err)  {
    req.flash("error", "Error creating account: " + err._message);
    req.flash("formData", req.body);
    return res.redirect("/admin/register"); 
})
})
.catch(function(err)  {
    req.flash("error", "Error creating account: " + err._message);
    req.flash("formData", req.body);
    res.redirect("/admin/register"); 
})
}

const adminLogin = function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        req.flash("error", "Email and password are required");
        res.redirect("/admin/login");
    }
    Admin.findOne({email})
    .then(function (admin) {
        if (!admin) {
            req.flash("error", "Admin account with that email does not exist.");
            req.flash("formData", req.body);
            return res.redirect("/admin/login");
        }


        const passwordMatch = bcrypt.compareSync(password, admin.password);
        if(!passwordMatch){
            req.flash("error", "incorrect password.");
            req.flash("formData", req.body);
            res.redirect("/admin/login"); 
        }else{
            req.session.adminId = admin._id;
            res.redirect("/")
        }
        
    })
}
const adminProfile = function(req, res) {
    const adminId = req.session.adminId;
    Admin.findById(adminId)
.then(function(admin ){
if(!admin){
    req.flash("error" ,"error fetching profile.");
    return res.redirect("/admin/login")

}
Product.find({admin: adminId})
.then(function(products) {
res.render("admin_profile.ejs",{profile:admin, products})
})
})
.catch(function(){
    req.flash("error","error fetching profile.");
    res.redirect("/admin/login")
})
}

const logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect("/");
    })
}
module.exports = {
    registerPage,
    loginPage,
    createAccount,
    adminLogin,
    adminProfile,
    logout
}