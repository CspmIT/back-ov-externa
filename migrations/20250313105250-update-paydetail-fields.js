'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('PaysDetails', 'cod_com', {
			type: Sequelize.INTEGER,
			allowNull: false,
		})
		await queryInterface.addColumn('PaysDetails', 'suc_com', {
			type: Sequelize.INTEGER,
			allowNull: false,
		})
		await queryInterface.addColumn('PaysDetails', 'num_com', {
			type: Sequelize.INTEGER,
			allowNull: false,
		})
		await queryInterface.changeColumn('PaysDetails', 'amount', {
			type: Sequelize.DECIMAL(10, 2),
			allowNull: false,
		})
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('PaysDetails', 'cod_com')
		await queryInterface.removeColumn('PaysDetails', 'suc_com')
		await queryInterface.removeColumn('PaysDetails', 'num_com')
		await queryInterface.changeColumn('PaysDetails', 'amount', {
			type: Sequelize.DECIMAL,
			allowNull: true,
		})
	},
}
