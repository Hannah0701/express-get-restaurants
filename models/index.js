const Restaurant = require('./Restaurant');
const Menu = require('./Menu');
const Item = require('./Item');

Restaurant.hasMany(Menu);
Menu.belongsTo(Restaurant);

Item.belongsToMany(Menu, {through: 'menu_items'});
Menu.belongsToMany(Item, {through: 'menu_items'});

module.exports = { Restaurant, Menu, Item };
