'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class PaysMethodEnabled extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.PaysMethods, { foreignKey: 'id_method' })
		}
	}
	PaysMethodEnabled.init(
		{
			id_method: DataTypes.INTEGER,
			api_key: DataTypes.STRING,
			access_token: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'PaysMethodEnabled',
		}
	)
	return PaysMethodEnabled
}
