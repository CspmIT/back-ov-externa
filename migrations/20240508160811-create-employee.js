'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Employees', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			social_email: {
				type: Sequelize.STRING,
			},
			internar_number: {
				type: Sequelize.STRING,
			},
			external_number: {
				type: Sequelize.STRING,
			},
			status: {
				type: Sequelize.BOOLEAN,
			},
			docket: {
				type: Sequelize.INTEGER,
			},
			docket_status: {
				type: Sequelize.BOOLEAN,
			},
			cuil: {
				type: Sequelize.BIGINT,
			},
			date_entry: {
				type: Sequelize.DATE,
			},
			id_person_physical: {
				type: Sequelize.INTEGER,
				references: { model: 'Person_physicals', key: 'id' },
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			profile: {
				type: Sequelize.INTEGER,
				comment: '1- moderador, 2-Lector, 3-operador',
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
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Employees')
	},
}
