'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('PaysMethodEnableds', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			id_method: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: 'PaysMethods',
					key: 'id',
				},
			},
			api_key: {
				type: Sequelize.STRING,
			},
			access_token: {
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
		await queryInterface.dropTable('PaysMethodEnableds')
	},
}
