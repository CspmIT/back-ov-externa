'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Person_legal extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.Person, { foreignKey: 'id_person', targetKey: 'id', as: 'dataPerson' })
		}
	}
	Person_legal.init(
		{
			social_raeson: DataTypes.STRING,
			fantasy_name: DataTypes.STRING,
			cuit: DataTypes.BIGINT,
			date_registration: DataTypes.DATE,
			authorization_img: DataTypes.STRING,
			id_person: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Person_legal',
		}
	)
	return Person_legal
}
