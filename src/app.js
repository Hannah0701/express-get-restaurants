const express = require("express");
const app = express();
const { Restaurant, Menu, Item } = require("../models/index")
const db = require("../db/connection");
const { check, validationResult } = require("express-validator");

//TODO: Create your GET Request Route Below: 

app.get("/restaurants", async (req, res) => {
//     Get all restaurants via the Restaurant.findAll() method within the route.
// Remember to use async and await
    const restaurants = await Restaurant.findAll({
            include: {
                model: Menu,
                include: [
                    {
                        model: Item,
                    }
                ]
            }
        });
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

app.get("/restaurants/:id", async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    res.json(restaurant);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/restaurants", [
    check("name").notEmpty(options = { ignore_whitespace: true }),
    check("location").notEmpty(options = { ignore_whitespace: true }),
    check("cuisine").notEmpty(options = { ignore_whitespace: true })
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        const restaurant = await Restaurant.create(req.body);
        res.status(200).json(restaurant);
    }
});

// to test used raw json in postman: 
// {
//     "name": "Opheem",
//     "location": "Birmingham",
//     "cuisine": "Fine Dining"
// }

// response once submitted:
// {
//     "id": 4,
//     "name": "Opheem",
//     "location": "Birmingham",
//     "cuisine": "Fine Dining",
//     "updatedAt": "2024-05-21T12:46:30.572Z",
//     "createdAt": "2024-05-21T12:46:30.572Z"
// }

app.put("/restaurants/:id", async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.json(restaurant);
});

// to test used raw json in postman on restaurant/4: 
// {
//     "name": "Tapas Molecular Bar",
//     "location": "Tokyo",
//     "cuisine": "Fine Dining"
// }

// response once submitted:
// {
//     "id": 4,
//     "name": "Tapas Molecular Bar",
//     "location": "Tokyo",
//     "cuisine": "Fine Dining",
//     "createdAt": "2024-05-21T12:46:30.572Z",
//     "updatedAt": "2024-05-21T12:49:14.630Z"
// }

app.delete("/restaurants/:id", async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.destroy();
    res.json(restaurant);
});

// deleted through postman with restaurant/4 response null after this on get request

module.exports = app;