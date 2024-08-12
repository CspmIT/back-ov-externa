'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class City extends Model {
		static associate(models) {
			City.belongsToMany(models.Street, {
				through: 'Street_City',
				as: 'Streets',
				foreignKey: 'id_city',
			})
			City.hasMany(models.Address, {
				foreignKey: 'id_city',
				sourceKey: 'cod_loc',
			})
		}
	}
	City.init(
		{
			cod_loc: DataTypes.BIGINT,
			des_loc: DataTypes.STRING,
			cod_pos: DataTypes.BIGINT,
			cod_pci: DataTypes.BIGINT,
		},
		{
			sequelize,
			modelName: 'City',
		}
	)
	return City
}
