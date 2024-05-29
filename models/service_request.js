'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Service_Request extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Person, { foreignKey: 'id_person', targetKey: 'id', as: 'People' })
			this.belongsTo(models.User, { foreignKey: 'id_user', as: 'Users' })
			this.hasMany(models.Service_Items, { foreignKey: 'id_service_request', as: 'ServiceItems' })
		}
	}
	Service_Request.init(
		{
			id_person: DataTypes.INTEGER,
			id_user: { type: DataTypes.INTEGER, allowNull: false },
			status: { type: DataTypes.TINYINT, allowNull: false },
			return_later: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
		},
		{
			sequelize,
			modelName: 'Service_Request',
		}
	)
	return Service_Request
}
