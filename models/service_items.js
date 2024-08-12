'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Service_Items extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Service_Request, {
				foreignKey: 'id_service_request',
				as: 'items',
			})
		}
	}

	Service_Items.init(
		{
			id_service_request: { type: DataTypes.INTEGER, allowNull: false },
			id_service_form: { type: DataTypes.INTEGER, allowNull: false },
			service_type: { type: DataTypes.TINYINT, allowNull: false },
			status: { type: DataTypes.TINYINT, allowNull: false },
			cod_sum: DataTypes.INTEGER,
			service_name: { type: DataTypes.STRING, allowNull: false },
		},
		{
			sequelize,
			modelName: 'Service_Items',
		}
	)
	return Service_Items
}
