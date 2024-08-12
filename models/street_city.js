'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Street_City extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Street, { foreignKey: 'id_street', as: 'Streets' })
			this.belongsTo(models.City, { foreignKey: 'id_city', as: 'Cities' })
		}
	}
	Street_City.init(
		{
			status: DataTypes.BOOLEAN,
			id_street: DataTypes.INTEGER,
			id_city: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Street_City',
		}
	)
	return Street_City
}
