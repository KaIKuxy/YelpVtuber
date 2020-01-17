const mongoose = require("mongoose");
const Comment = require("./comment");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// SCHEMA SETUP
const vtuberprofileSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

vtuberprofileSchema.pre("remove", async function() {
    await Comment.deleteMany({
        _id: {
            $in: this.comments
        }
    });
})

module.exports = mongoose.model("Vtuberprofile", vtuberprofileSchema);