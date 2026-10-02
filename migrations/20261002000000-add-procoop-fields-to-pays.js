'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Pays', 'cod_pag', {
			type: Sequelize.STRING,
			allowNull: true,
			comment: 'Codigo de solicitud devuelto por Procoop (RegistrarSolicitud); permite reintentar la imputacion sin duplicar la solicitud',
		})
		await queryInterface.addColumn('Pays', 'total_procoop', {
			type: Sequelize.DECIMAL(18, 2),
			allowNull: true,
			comment: 'Total a pagar devuelto por Procoop al registrar la solicitud; requerido para autorizar el pago',
		})
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('Pays', 'cod_pag')
		await queryInterface.removeColumn('Pays', 'total_procoop')
	},
}
