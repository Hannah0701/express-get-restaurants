const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require('supertest');
const app = require('./src/app.js');
// const db = require('./db/connection');
const { Restaurant, Menu, Item } = require('./models/index');

describe('/restaurants endpoint', () => {
    // beforeEach(async () => {
    //     await db.sync({force: true});
    // });

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

    // test("GET /restaurants/:id should return a single restaurant with menu and items", async () => {
    //     await Restaurant.create(
    //       {
    //         name: 'Tapas Molecular Bar',
    //         location: 'Tokyo',
    //         cuisine: 'Japanese',
    //         menus: [
    //             {
    //             title: 'Main Menu',
    //             items: [
    //                 {
    //                 name: 'Sushi',
    //                 image: 'test.jpg',
    //                 price: 15.99,
    //                 vegetarian: false
    //                 },
    //               ],
    //             },
    //         ],
    //       },
    //     );
    //     const restaurant = await request(app).get("/restaurants/4");
    //     expect(restaurant.body).toMatchObject({
    //         name: 'Tapas Molecular Bar',
    //         location: 'Tokyo',
    //         cuisine: 'Japanese',
    //         menus: [
    //             {
    //                 title: 'Main Menu',
    //                 items: [
    //                     {
    //                         name: 'Sushi',
    //                         image: 'test.jpg',
    //                         price: 15.99,
    //                         vegetarian: false
    //                     },
    //                 ],
    //             },
    //         ],
    //     });
    // });

    test("GET /restaurants/:id should return a single restaurant with menu and items", async () => {
        const restaurant = await Restaurant.create({
              name: 'Tapas Molecular Bar',
              location: 'Tokyo',
              cuisine: 'Japanese',
        });
        const menu = await restaurant.createMenu({
            title: 'Main Menu'
        });
        await menu.createItem({
                name: 'Sushi',
                image: 'test.jpg',
                price: 15.99,
                vegetarian: false
        });
        const menus = await restaurant.getMenus();
        const items = await menu.getItems();

        expect(restaurant).toMatchObject({
            name: 'Tapas Molecular Bar',
            location: 'Tokyo',
            cuisine: 'Japanese'
        });
        expect(menus).toMatchObject([
            {
                title: 'Main Menu',
                restaurantId: 4
            }
        ]);
        expect(items).toMatchObject([
            {
                name: 'Sushi',
                image: 'test.jpg',
                price: 15.99,
                vegetarian: false,
                menu_items: {
                    itemId: 4,
                    menuId: 4,
                }
            }
        ]);

    });

    test("POST should add a new restaurant", async () => {
        const newRestaurant = {
            name: 'Burger King',
            location: 'Texas',
            cuisine: 'FastFood'
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject(newRestaurant);
    });

    test("POST validation returns error when name is empty", async () => {
        const newRestaurant = {
            name: '',
            location: 'Texas',
            cuisine: 'FastFood'
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errors: [
                {
                    value: '',
                    msg: 'Invalid value',
                    path: 'name',
                    type: 'field',
                    location: 'body'
                }
            ]
        });
    });

    test("POST validation returns error when name is empty whitespace", async () => {
        const newRestaurant = {
            name: ' ',
            location: 'Texas',
            cuisine: 'FastFood'
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errors: [
                {
                    value: ' ',
                    msg: 'Invalid value',
                    path: 'name',
                    type: 'field',
                    location: 'body'
                }
            ]
        });
    });

    test("POST validation returns error when location is empty", async () => {
        const newRestaurant = {
            name: 'Burger King',
            location: '',
            cuisine: 'FastFood'
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errors: [
                {
                    value: '',
                    msg: 'Invalid value',
                    path: 'location',
                    type: 'field',
                    location: 'body'
                }
            ]
        });
    });

    test("POST validation returns error when location is empty whitespace", async () => {
        const newRestaurant = {
            name: 'Burger King',
            location: ' ',
            cuisine: 'FastFood'
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errors: [
                {
                    value: ' ',
                    msg: 'Invalid value',
                    path: 'location',
                    type: 'field',
                    location: 'body'
                }
            ]
        });
    });

    test("POST validation returns error when name is empty", async () => {
        const newRestaurant = {
            name: 'Burger King',
            location: 'Texas',
            cuisine: ''
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errors: [
                {
                    value: '',
                    msg: 'Invalid value',
                    path: 'cuisine',
                    type: 'field',
                    location: 'body'
                }
            ]
        });
    });

    test("POST validation returns error when name is empty whitespace", async () => {
        const newRestaurant = {
            name: 'Burger King',
            location: 'Texas',
            cuisine: ' '
        };
        const response = await request(app).post("/restaurants").send(newRestaurant);
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            errors: [
                {
                    value: ' ',
                    msg: 'Invalid value',
                    path: 'cuisine',
                    type: 'field',
                    location: 'body'
                }
            ]
        });
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

