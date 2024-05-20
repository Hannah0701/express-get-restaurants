const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

//TODO: Create your GET Request Route Below: 

app.get("/restaurants", async (req, res) => {
//     Get all restaurants via the Restaurant.findAll() method within the route.
// Remember to use async and await
    const restaurants = await Restaurant.findAll({});
        // Send the restaurants as a JSON Response (res.json())
    res.json(restaurants);
});


// app.get("/restaurants", (req, res) => {
// //     Get all restaurants via the Restaurant.findAll() method within the route.
// // Remember to use async and await
//     Restaurant.findAll().then((restaurants) => {
//         // Send the restaurants as a JSON Response (res.json())
//         res.json(restaurants);
//     });
// });

module.exports = app;