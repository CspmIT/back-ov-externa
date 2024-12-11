'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Service_Form', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            type_activity: {
                type: Sequelize.TINYINT,
                allowNull: true,
            },
            id_files_form: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            id_connection_address: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            form_data: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            connection_address_tmp: {
                type: Sequelize.JSON,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })

        // Creo la relacion con el id_service_form de la tabla Service_Items
        await queryInterface.addConstraint('Service_Items', {
            fields: ['id_service_form'],
            type: 'foreign key',
            name: 'fk_id_service_form',
            references: {
                table: 'Service_Form',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Service_Form')
        await queryInterface.removeConstraint(
            'Service_Items',
            'fk_id_service_form'
        )
    },
}
