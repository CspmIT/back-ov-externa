'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Pay extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.hasMany(models.PaysDetail, { foreignKey: 'id_pay', as: 'details' })
			this.belongsTo(models.PaysMethods, { foreignKey: 'id_method', as: 'method' })
		}
	}
	Pay.init(
		{
			id_user: DataTypes.INTEGER,
			customer: DataTypes.INTEGER,
			name_customer: DataTypes.STRING,
			total: DataTypes.DECIMAL,
			id_external: DataTypes.STRING,
			type_pay: DataTypes.STRING,
			id_method: DataTypes.INTEGER,
			status: DataTypes.INTEGER,
			confirmed: DataTypes.INTEGER,
			message: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Pay',
		}
	)
	return Pay
}
