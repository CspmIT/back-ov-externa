'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
	class Employee extends Model {
		static associate(models) {
			// define association here
			this.belongsTo(models.Person_physical, { foreignKey: 'id_person_physical', targetKey: 'id', as: 'personPhysical' })
		}
	}
	Employee.init(
		{
			social_email: DataTypes.STRING,
			internar_number: DataTypes.STRING,
			external_number: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
			docket: DataTypes.INTEGER,
			docket_status: DataTypes.BOOLEAN,
			cuil: DataTypes.BIGINT,
			date_entry: DataTypes.DATE,
			id_person_physical: DataTypes.INTEGER,
			profile: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Employee',
		}
	)
	return Employee
}

// 'use strict'
// const { DataTypes } = require('sequelize')
// const { sequelizeCoopm_v2 } = require('../database/MySQL.database')

// const Employee = sequelizeCoopm_v2.define(
//     'Employees',
//     {
//         social_email: DataTypes.STRING,
//         internar_number: DataTypes.STRING,
//         external_number: DataTypes.STRING,
//         status: DataTypes.BOOLEAN,
//         docket: DataTypes.INTEGER,
//         docket_status: DataTypes.BOOLEAN,
//         cuil: DataTypes.BIGINT,
//         date_entry: DataTypes.DATE
//     },
//     {}
// )

// module.exports = Employee
