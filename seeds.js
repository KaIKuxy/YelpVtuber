const mongoose = require("mongoose");
const Vtuberprofile = require("./models/vtuberprofile");
const Comment = require("./models/comment");

var data = [
    {
        name: "Minato Aqua",
        image: "https://yt3.ggpht.com/a/AGF-l79lFypl4LxY5kf60UpCL6gakgSGHtN-t8hq1g=s176-c-k-c0x00ffffff-no-rj-mo",
        description: "バーチャルメイド⚓️湊あくあ(みなとあくあ)です！ど、ドジとか言わないでください！\n放送で色んな変わったゲームや雑談をしています…！！\n【生放送】#湊あくあ生放送【関連ツイート】#湊あくあ 【ファン】 #あくあクルー【絵文字】⚓️【ﾌｧﾝｱｰﾄ】 #あくあーと ※動画やﾂｲｰﾄで使用させて頂くことがあります。担当絵師：がおう先生【@umaiyo_puyoman】"
    },
    {
        name: "Yuzuki Roa",
        image: "https://yt3.ggpht.com/a/AGF-l79gkgR05I6pSCM2VQUZfalk4YV0WemNwfXGzg=s176-c-k-c0x00ffffff-no-rj-mo",
        description: "test"
    },
    {
        name: "Suzuhara Lulu",
        image: "https://yt3.ggpht.com/a/AGF-l7-3Dcc3AuL3_FXsiBFgOOBTuL8XUiYIWebhOA=s176-c-k-c0x00ffffff-no-rj-mo",
        description: "test"
    }
]

function seedDB() { 
    // Remove all Vtubers
    Vtuberprofile.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("vtubers removed!")

        // Add a few Vtubers
        data.forEach((seed) => {
            Vtuberprofile.create(seed, (err, vtuber) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Vtuber added");
                    Comment.create({
                        text: "This Vtuber is cuuuute...",
                        author: "Tester"
                    }, (err, comment) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            vtuber.comments.push(comment);
                            vtuber.save();
                            console.log("New comment created")
                        }
                    });
                }
            });
        });
    });
    

    // Add a few comments
 }

 module.exports = seedDB;