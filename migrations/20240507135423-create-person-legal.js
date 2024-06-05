'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Person_legals', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			social_raeson: {
				type: Sequelize.STRING,
			},
			fantasy_name: {
				type: Sequelize.STRING,
			},
			cuit: {
				type: Sequelize.BIGINT,
			},
			date_registration: {
				type: Sequelize.DATE,
			},
			authorization_img: {
				type: Sequelize.STRING,
			},
			id_person: {
				type: Sequelize.INTEGER,
				references: {
					model: 'People',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
		await queryInterface.dropTable('Person_legals')
	},
}
