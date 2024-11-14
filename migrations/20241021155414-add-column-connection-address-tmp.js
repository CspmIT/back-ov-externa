'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Service_Form',
            'connection_address_tmp',
            {
                type: Sequelize.JSON,
                allowNull: true,
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn(
            'Service_Form',
            'connection_address_tmp'
        );
    },
};
