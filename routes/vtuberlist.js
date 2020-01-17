const express = require("express");
const router = express.Router();
const Vtuberprofile = require("../models/vtuberprofile");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    // console.log(req.user);
    // Get all vtuber profiles from DB
    Vtuberprofile.find({}, (err, allVtuberprofiles) => {
        if (err || !allVtuberprofiles) {
            req.flash("error", "Failed to find vtuber profile");
            res.redirect("back");
        }
        else {
            res.render("vtuberprofile/index", {vtuberlist: allVtuberprofiles, currentUser: req.user});
        }
    });
    // res.render("vtuberlist", {vtuberlist: vtuberlist});
});

// Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const creator = {
        id: req.user._id,
        username: req.user.username,
    };
    const newVtuber = {name: name, image: image, description: description, creator: creator};
    Vtuberprofile.create(newVtuber, (err, newlyCreated) => {
        if (err || !newlyCreated) {
            req.flash("error", "Failed to create vtuber");
            res.redirect("back");
        }
        else {
            req.flash("success", "New Vtuber profile created");
            res.redirect("/vtuberlist");
        }
    });
    // vtuberlist.push(newVtuber);
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("vtuberprofile/new");
});

// Show - shows more info about one vtuber
router.get("/:id", (req, res) => {
    // find the vtuber profile with provided ID
    Vtuberprofile.findById(req.params.id).populate("comments").exec((err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Vtuber not found");
            res.redirect("back");
        }
        else {
            // render show templace with that vtuber profile
            res.render("vtuberprofile/show", {vtuber: foundVtuber});
        }
    });
});

// Edit Vtuberprofile Route
router.get("/:id/edit", middleware.checkVtuberProfileOwnership, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        res.render("vtuberprofile/edit", {vtuber: foundVtuber});
    });
});

// Update Vtuber profile Route
router.put("/:id", middleware.checkVtuberProfileOwnership, (req, res) => {
    Vtuberprofile.findByIdAndUpdate(req.params.id, req.body.vtuberprofile, (err, updatedVtuber) => {
        if (err || !updatedVtuber) {
            req.flash("error", "Failed to update vtuber profile");
            res.redirect("back");
        }
        else {
            req.flash("success", "Vtuber profile updated");
            res.redirect("/vtuberlist/" + req.params.id);
        }
    });
});


// Destroy Vtuber profile Route
router.delete("/:id", middleware.checkVtuberProfileOwnership, (req, res) => {
    Vtuberprofile.findById(req.params.id, (err, foundVtuber) => {
        if (err || !foundVtuber) {
            req.flash("error", "Failed to delete vtuber");
            res.redirect("/vtuberlist");
        }
        else {
            foundVtuber.remove((err) => {
                if (err) {
                    req.flash("error", "Failed to delete vtuber");
                    res.redirect("/vtuberlist/" + req.params.id);
                }
                else {
                    req.flash("success", "Vtuber deleted");
                    res.redirect("/vtuberlist");
                }
            });
        }
    });
});

module.exports = router;