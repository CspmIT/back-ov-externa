'use strict';

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
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Service_Form');
    },
};
