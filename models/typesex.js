'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class TypeSex extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.Person_physical, {
				as: 'Person_physicals',
				foreignKey: 'id_type_sex',
			})
			// define association here
		}
	}
	TypeSex.init(
		{
			description: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'TypeSex',
		}
	)
	return TypeSex
}
