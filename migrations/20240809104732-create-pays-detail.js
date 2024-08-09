'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('PaysDetails', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			id_pay: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'Pays',
					key: 'id',
				},
			},
			description: {
				type: Sequelize.STRING,
			},
			account: {
				type: Sequelize.INTEGER,
			},
			amount: {
				type: Sequelize.DECIMAL,
			},
			reference: {
				type: Sequelize.STRING,
			},
			ss: {
				type: Sequelize.BOOLEAN,
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
		await queryInterface.dropTable('PaysDetails')
	},
}
