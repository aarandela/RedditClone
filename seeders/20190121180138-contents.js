'use strict'

const faker = require('faker')

let contents = []

for (let i = 1; i <= 5; i++) {
  contents.push({
    title: faker.hacker.noun(),
    url: faker.hacker.phrase(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userID: 2
  })
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('contents', contents, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
}
