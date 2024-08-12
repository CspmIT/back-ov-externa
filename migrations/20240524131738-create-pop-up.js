'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('PopUps', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			description: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			level: {
				type: Sequelize.TINYINT,
			},
			status: {
				allowNull: false,
				type: Sequelize.TINYINT,
			},
			date_start: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			date_end: {
				type: Sequelize.DATE,
			},
			img: {
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
		await queryInterface.dropTable('PopUps')
	},
}
