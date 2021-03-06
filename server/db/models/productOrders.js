const Sequelize = require('sequelize')
const db = require('../db')

const ProductOrders = db.define('productOrders', {
  priceAtPurchase: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  }
})

ProductOrders.prototype.setQuantity = function(num) {
  this.quantity = num
  this.save()
}

module.exports = ProductOrders
