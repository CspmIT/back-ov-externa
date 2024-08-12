'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Person_Addresses', 'id_person', {
			type: Sequelize.INTEGER,
			references: {
				model: 'People',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
		await queryInterface.addColumn('Person_Addresses', 'id_address', {
			type: Sequelize.INTEGER,
			references: {
				model: 'Addresses',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Person_Addresses', 'id_address')
		await queryInterface.removeColumn('Person_Addresses', 'id_person')
	},
}
