const Admin = require("../models/admin.models");


const adminAuth = function(req, res, next) {
    if(!req.session.adminId){
        req.flash("error", "you need to login first");
        return res.redirect("/admin/login");
    }
    Admin.findById(req.session.adminId)
    .then(function(admin) {
        if(!admin) {
            req.flash("error", "you need to login first");
            return res.redirect("/admin/login");
        }
        next();
    })
    .catch(function() {
        req.flash("error", "Validation error.");
        return res.redirect("/admin/login");
    })
}

    module.exports = adminAuth;