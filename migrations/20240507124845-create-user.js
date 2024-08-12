'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name_register: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			last_name_register: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: { type: Sequelize.STRING, email: true, unique: true, allowNull: false },
			email_verified: Sequelize.DATE,
			password: { type: Sequelize.STRING, is: /^(?=.*[A-Z]).{6,}$/ },
			token_temp: { type: Sequelize.STRING, allowNull: true },
			lvl2_date: {
				type: Sequelize.DATE,
			},
			lvl3_date: {
				type: Sequelize.DATE,
			},
			img_profile: {
				type: Sequelize.STRING,
			},
			dark: {
				type: Sequelize.BOOLEAN,
			},
			type_person: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: '1: persona fisica, 2: persona legal',
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
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
		await queryInterface.dropTable('Users')
	},
}
