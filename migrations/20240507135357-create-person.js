'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('People', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			procoop_last_name: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},

			number_customer: {
				type: Sequelize.INTEGER,
			},
			type_person: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			situation_tax: {
				type: Sequelize.INTEGER,
				comment: 'id de situacion impositiva',
			},
			fixed_phone: {
				type: Sequelize.STRING,
			},
			cell_phone: {
				type: Sequelize.STRING,
			},
			type_document: {
				type: Sequelize.INTEGER,
			},
			number_document: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('People')
	},
}
