'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Person_physicals', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			last_name: {
				type: Sequelize.STRING,
			},
			type_dni: {
				type: Sequelize.INTEGER,
			},
			num_dni: {
				type: Sequelize.INTEGER,
			},
			born_date: {
				type: Sequelize.DATE,
			},
			blood_type: {
				type: Sequelize.STRING,
			},
			factor: {
				type: Sequelize.STRING,
			},
			donor: {
				type: Sequelize.BOOLEAN,
			},
			validation_renaper: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			id_type_sex: {
				type: Sequelize.INTEGER,
				references: {
					model: 'TypeSexes',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
		await queryInterface.dropTable('Person_physicals')
	},
}
