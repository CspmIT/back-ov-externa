'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Commentary extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.User, { as: 'User', foreignKey: 'id_user' })
		}
	}
	Commentary.init(
		{
			text_opinion: DataTypes.STRING,
			score: DataTypes.INTEGER,
			id_user: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'Commentary',
			tableName: 'Commentaries',
		}
	)
	return Commentary
}
