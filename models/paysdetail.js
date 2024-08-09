'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class PaysDetail extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Pay, { foreignKey: 'id_pay', as: 'pay' })
		}
	}
	PaysDetail.init(
		{
			id_pay: DataTypes.INTEGER,
			description: DataTypes.STRING,
			account: DataTypes.INTEGER,
			amount: DataTypes.DECIMAL,
			reference: DataTypes.STRING,
			ss: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'PaysDetail',
		}
	)
	return PaysDetail
}
