const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require('supertest');
const app = require('./src/app.js');
const { Restaurant, Menu, Item } = require('./models/index');

describe('/restaurants endpoint', () => {
    test("status is 200", async () => {
        const restaurants = await request(app).get("/restaurants");
        expect(restaurants.status).toBe(200);
    });

    test("GET should return an array of restaurants", async () => {
        const restaurants = await request(app).get("/restaurants");
        expect(Array.isArray(restaurants.body)).toBe(true);
    });

    test("GET should return the correct number of restaurants", async () => {
        const restaurants = await request(app).get("/restaurants");
        expect(restaurants.body.length).toBe(3);
    });

    test("GET should return a list of restaurants", async () => {
        const restaurants = await request(app).get("/restaurants");
        expect(restaurants.body).toMatchObject([
            {
              name: 'AppleBees',
              location: 'Texas',
              cuisine: 'FastFood'
            },
            {
              name: 'LittleSheep',
              location: 'Dallas',
              cuisine: 'Hotpot'
            },
            {
              name: 'Spice Grill',
              location: 'Houston',
              cuisine: 'Indian'
            }
        ]);
    });

    test("GET /restaurants/:id should return a single restaurant", async () => {
        const restaurant = await request(app).get("/restaurants/1");
        expect(restaurant.body).toMatchObject({
            name: 'AppleBees',
            location: 'Texas',
            cuisine: 'FastFood'
        });
    });

    test("POST should add a new restaurant", async () => {
        const newRestaurant = {
            name: 'Burger King',
            location: 'Texas',
            cuisine: 'FastFood'
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.body).toMatchObject(newRestaurant);
    });

    test("PUT should update a restaurant", async () => {
        const updatedRestaurant = {
            name: 'Mcdonalds',
            location: 'New York',
            cuisine: 'FastFood'
        };
        const response = await request(app).put("/restaurants/1").send(updatedRestaurant);
        expect(response.body).toMatchObject(updatedRestaurant);
    });

    test("DELETE should remove a restaurant", async () => {
        const response = await request(app).delete("/restaurants/1");
        expect(response.body).toMatchObject({
            name: 'Mcdonalds',
            location: 'New York',
            cuisine: 'FastFood'
        });
    });

});

