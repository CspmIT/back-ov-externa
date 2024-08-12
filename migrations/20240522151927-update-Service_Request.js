'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 */
		await queryInterface.addColumn('Service_Requests', 'return_later', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false })
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.removeColumn('Service_Requests', 'return_later')
	},
}
