'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const date = new Date()
        await queryInterface.bulkInsert('ParamsApps', [
            {
                name: 'statusApp',
                status: true,
                createdAt: date,
                updatedAt: date,
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('ParamsApps', null, {})
    },
}
