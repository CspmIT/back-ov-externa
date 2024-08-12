'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class State extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			State.hasMany(models.Address, {
				foreignKey: 'id_state',
				sourceKey: 'cod_pro',
			})
		}
	}
	State.init(
		{
			cod_pro: DataTypes.BIGINT,
			des_pro: DataTypes.STRING,
			cod_afip: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'State',
		}
	)
	return State
}
