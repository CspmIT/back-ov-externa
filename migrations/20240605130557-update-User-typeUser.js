'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Modificacion de la tabla users, para agregar el campo user_type para identificar que tipo de usuario es, si es interno o externo
		// await queryInterface.addColumn('Users', 'user_type', {
		// 	type: Sequelize.INTEGER,
		// 	allowNull: true,
		// 	comment: '0- es externo, 1- es interno',
		// 	defaultValue: 0,
		// })
		await queryInterface.addColumn('Users', 'token_app', {
			type: Sequelize.STRING,
			allowNull: true,
			comment: 'token utilizado para logeo desde cooptech',
		})
	},

	async down(queryInterface, Sequelize) {
		// await queryInterface.removeColumn('Users', 'user_type')
		await queryInterface.removeColumn('Users', 'token_app')
	},
}
