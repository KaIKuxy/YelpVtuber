const   Vtuberprofile   = require("../models/vtuberprofile"),
        Comment         = require("../models/comment");

// All the middleware goes here

const middlewareObj = {};
middlewareObj.checkVtuberProfileOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
            if (err || !foundVtuber) {
                req.flash("error", "Vtuber not found");
                res.redirect("back");
            } else {
                if (foundVtuber.creator.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;