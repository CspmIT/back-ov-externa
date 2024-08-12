'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Person_physical extends Model {
		static associate(models) {
			this.belongsTo(models.Person, { foreignKey: 'id_person', targetKey: 'id', as: 'dataPerson' })
			this.belongsTo(models.TypeSex, { foreignKey: 'id_type_sex', as: 'typeSex' })
			this.hasOne(models.Employee, { foreignKey: 'id_person_physical', as: 'personPhysical' })
		}
	}
	Person_physical.init(
		{
			name: DataTypes.STRING,
			last_name: DataTypes.STRING,
			type_dni: DataTypes.INTEGER,
			num_dni: DataTypes.INTEGER,
			born_date: DataTypes.DATE,
			blood_type: DataTypes.STRING,
			factor: DataTypes.STRING,
			donor: DataTypes.INTEGER,
			validation_renaper: DataTypes.INTEGER,
			id_type_sex: DataTypes.INTEGER,
			id_person: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Person_physical',
		}
	)
	return Person_physical
}
