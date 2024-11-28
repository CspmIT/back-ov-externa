'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const date = new Date()
        await queryInterface.bulkInsert(
            'TypeSexes',
            [
                {
                    description: 'FEMENINO',
                    proccopName: 'F',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'MASCULINO',
                    proccopName: 'M',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'NO BINARIO',
                    proccopName: 'B',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'OTROS',
                    procoopName: 'O',
                    status: 1,
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    description: 'SIN ASIGNAR',
                    procoopName: '',
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
