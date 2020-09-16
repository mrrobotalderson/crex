'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const assetsP = queryInterface.bulkInsert('assets', [{
      symbol: 'BTC',
      description: 'The alpha and omega'
    }], {})
    return Promise.all([assetsP])
  },
  down: (queryInterface, Sequelize) => {
    const assetsP = queryInterface.bulkDelete('assets', null, {})
    return Promise.all([assetsP])
  }
}