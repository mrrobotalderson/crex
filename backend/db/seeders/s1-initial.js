'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    const assetsP = queryInterface.bulkInsert('assets', [{
      symbol: 'BTC',
      description: 'The alpha and omega',
      address: '36Dj4FQ19nsdp5fTSmG8yv2sVDUE8iSHs5'
    }], {})
    return Promise.all([assetsP])
  },
  down: (queryInterface, Sequelize) => {
    const assetsP = queryInterface.bulkDelete('assets', null, {})
    return Promise.all([assetsP])
  }
}