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
        await queryInterface.addColumn('Service_Items', 'responsible', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addConstraint('Service_Items', {
            fields: ['responsible'],
            type: 'foreign key',
            name: 'service_items_responsible_fkey',
            references: {
                table: 'Users',
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
        await queryInterface.removeConstraint('Service_Items', 'service_items_responsible_fkey');
        await queryInterface.removeColumn('Service_Items', 'responsible');
    },
};
