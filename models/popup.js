'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class PopUp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PopUp.init({
    description: DataTypes.STRING,
    level: DataTypes.TINYINT,
    status: DataTypes.TINYINT,
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE,
    img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PopUp',
	tableName: 'PopUps',
  });
  return PopUp;
};