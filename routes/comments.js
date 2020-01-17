const express = require("express");
const router = express.Router({mergeParams: true});
const Vtuberprofile = require("../models/vtuberprofile");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Vtuber not found");
            res.redirect("back");
        }
        else {
            res.render("comments/new", {vtuber: foundVtuber});        
        }
    }); 
});

// Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Vtuber not fount");
            res.redirect("back");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err || !comment) {
                    req.flash("error", "Something went wrong...");
                    res.redirect("back");
                }
                else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    foundVtuber.comments.push(comment);
                    foundVtuber.save();
                    req.flash("success", "Comment added successfully...");
                    res.redirect("/vtuberlist/" + foundVtuber._id);
                }
            });
        }
    })
});

// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Vtuber not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {vtuber_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Vtuber not found");
            return res.redirect("back");
        }
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
            if (err || !updatedComment) {
                req.flash("Something went wrong with comment...");
                res.redirect("back");
            } else {
                req.flash("success", "Comment updated");
                res.redirect("/vtuberlist/" + req.params.id);
            }
        });
    })
    // res.send("You hit the comment route");
});

// Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Vtuber not found");
            return res.redirect("back");
        }
        Comment.findByIdAndRemove(req.params.comment_id, (err) => {
            if (err) {
                req.flash("Failed to delete comment");
                res.redirect("back");
            } else {
                req.flash("success", "Comment deleted");
                res.redirect("/vtuberlist/" + req.params.id);
            }
        });
    })
});

module.exports = router;