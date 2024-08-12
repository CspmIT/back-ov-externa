'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Person extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Person.hasOne(models.Person_physical, { foreignKey: 'id_person', targetKey: 'id', as: 'Person_physical' })
			Person.hasOne(models.Person_legal, { foreignKey: 'id_person', targetKey: 'id', as: 'Person_legal' })
			Person.hasOne(models.User, { foreignKey: 'id_person_profile', targetKey: 'id', as: 'person_profile' })
			Person.hasMany(models.Person_Address, { foreignKey: 'id_person', targetKey: 'id', as: 'Person_Address' })
			Person.hasMany(models.User_People, { foreignKey: 'id_person', targetKey: 'id', as: 'User_People' })
			Person.hasMany(models.Service_Request, { foreignKey: 'id_person', targetKey: 'id', as: 'Service_Request' })
		}
	}
	Person.init(
		{
			procoop_last_name: DataTypes.STRING,
			email: DataTypes.STRING,
			number_customer: DataTypes.INTEGER,
			type_person: DataTypes.INTEGER,
			situation_tax: DataTypes.INTEGER,
			fixed_phone: DataTypes.STRING,
			cell_phone: DataTypes.STRING,
			type_document: DataTypes.INTEGER,
			number_document: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Person',
			tableName: 'People',
		}
	)
	return Person
}
