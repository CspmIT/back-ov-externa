'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Street_Cities', 'id_street', {
			type: Sequelize.INTEGER,
			references: {
				model: 'Streets',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
		await queryInterface.addColumn('Street_Cities', 'id_city', {
			type: Sequelize.INTEGER,
			references: {
				model: 'Cities',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Street_Cities', 'id_street')
		await queryInterface.removeColumn('Street_Cities', 'id_city')
	},
}
