const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// 1. Move session middleware up and make it global or ensure it covers /customer
app.use("/customer", session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));

// 2. Authentication middleware logic
app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); 
            } else {
                return res.status(103).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(103).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

// 3. Mount routes
app.use("/customer", customer_routes); 
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));