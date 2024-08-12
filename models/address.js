'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Address extends Model {
		static associate(models) {
			this.belongsTo(models.City, { foreignKey: 'id_city', targetKey: 'id', as: 'city' })
			this.belongsTo(models.State, { foreignKey: 'id_state', targetKey: 'cod_pro', as: 'state' })
			this.belongsTo(models.Street, { foreignKey: 'id_street', as: 'street' })
			this.hasMany(models.Person_Address, { foreignKey: 'id_address', as: 'Person_Addresses' })
		}
	}
	Address.init(
		{
			number_address: DataTypes.STRING,
			floor: DataTypes.STRING,
			dpto: DataTypes.INTEGER,
			postal_code: DataTypes.DATE,
			google_address: DataTypes.STRING,
			id_street: DataTypes.INTEGER,
			id_city: DataTypes.INTEGER,
			id_state: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Address',
		}
	)
	return Address
}
