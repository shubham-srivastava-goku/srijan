const express       = require("express")
    , app           = express()
    , http          = require("http").createServer(app)
    , wajs          = require("wajs")
    , jwt           = require("jsonwebtoken")
    , secureRoutes  = express.Router()
    , url           = require("url");

const server = http.listen("8080", () => {
    console.log("Server started at " + server.address().port);
});


process.env.WA_APP_ID = "RVU3L7-X2EQLAETT7";
process.env.SECRET_KEY = "dummykey";

/*let user        = {};
user["name"]    = "shubham"; 
user["pass"]    = "shubham"; 

console.log(getAccesstoken(user));

function getAccesstoken(user) {
    let token = jwt.sign(user, process.env.SECRET_KEY, {
        expiresIn: (7 * 24 * 60 * 60)
    });
    return token;
}*/

var waClient = new wajs(process.env.WA_APP_ID);


var queryOptions = {
    format: 'image,plaintext,sound,wav',
    units: 'metric'
}

app.use("/secure", secureRoutes);

//Validatiom middleware
secureRoutes.use(function (req, res, next) {
    let token = req.get('token');

    if(!token) {
        res.send("Please send a token");
        return false;
    } 

    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if(err) {
            res.status(500).send("Invalid Token");
        } else {
            next();
        }
    });
});

/*var queryString = "weather";//url_parts.query.query;
        waClient.query(queryString, queryOptions)
            .then(function (resp) {
                console.log(resp.toJson());
                console.log("\n\n");
                console.log(resp.rawXml());

                /*let obj         = {};
                obj["jsonObj"]  = resp.toJson();
                obj["xmlObj"]   = resp.rawXml();

                res.json(obj);*/
            /*})
            .catch(function (err) {
                console.error("Error " + err);
                //res.status(500).send("Some error occured");
            });*/


secureRoutes.get("/app-get/getWolframRes", (req, res) => {
    try {
        var url_parts   = url.parse(req.url, true);
        var queryString = "weather";//url_parts.query.query;
        waClient.query(queryString, queryOptions)
            .then(function (resp) {
                /*console.log(resp.toJson());
                console.log("\n\n");
                console.log(resp.rawXml());*/

                let obj         = {};
                obj["jsonObj"]  = resp.toJson();
                obj["xmlObj"]   = resp.rawXml();

                res.json(obj);
            })
            .catch(function (err) {
                console.error("Error " + err);
                res.status(500).send("Some error occured");
            });
    } catch(e) {
        console.error("Error " + e.message);
        res.status(500).send("Some error occured");
    }
});