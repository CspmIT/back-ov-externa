'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addConstraint('Service_Form', {
            fields: ['id_connection_address'],
            type: 'foreign key',
            name: 'service_form_id_connection_address_fkey',
            references: {
                table: 'Person_Addresses',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeConstraint(
            'Service_Form',
            'service_form_id_connection_address_fkey'
        )
    },
}
