'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class PaysMethods extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.PaysMethodEnabled, { foreignKey: 'id_method' })
		}
	}
	PaysMethods.init(
		{
			name: DataTypes.STRING,
			logo: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'PaysMethods',
		}
	)
	return PaysMethods
}
