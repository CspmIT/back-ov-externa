'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Person_Address extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Person_legal, { foreignKey: 'id_person' })
			this.belongsTo(models.Address, { foreignKey: 'id_address', as: 'Address' })
		}
	}
	Person_Address.init(
		{
			status: DataTypes.BOOLEAN,
			id_person: DataTypes.INTEGER,
			id_address: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Person_Address',
		}
	)
	return Person_Address
}

// 'use strict'
// const { DataTypes } = require('sequelize')
// const { sequelizeCoopm_v2 } = require('../database/MySQL.database')

// const Person_Address = sequelizeCoopm_v2.define(
//     'Person_Addresses',
//     {
//         status: DataTypes.BOOLEAN,
//         Procoop_MembersId: DataTypes.INTEGER,
//         UserId: DataTypes.INTEGER,
//         AddressId: DataTypes.INTEGER
//     },
//     {}
// )

// module.exports = Person_Address
