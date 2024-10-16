'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        // Agrego una clave foranea a la tabla Service_Items
        await queryInterface.addConstraint('Service_Items', {
            fields: ['id_service_form'],
            type: 'foreign key',
            name: 'service_items_id_service_form_fk',
            references: {
                //Required field
                table: 'Service_Form',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeConstraint('Service_Items', 'service_items_id_service_form_fk');
    },
};
