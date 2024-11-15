'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const date = new Date()
        await queryInterface.bulkInsert(
            'TypeSexes',
            [
                {
                    description: 'Femenino',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'Masculino',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'No binario',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'Otros',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
            ],
            []
        )
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('TypeSexes', null, {})
    },
}
