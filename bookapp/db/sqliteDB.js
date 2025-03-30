const { initCart } = require('../backend/models/cart');
const { initTokens } = require('../backend/models/token');

const initSQLite = () => {
  initCart();
  initTokens();
};

module.exports = { initSQLite };