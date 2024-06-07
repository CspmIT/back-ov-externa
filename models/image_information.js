'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image_Information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
			Image_Information.belongsTo(models.Information, { foreignKey: 'id_information', as: 'Information' })    }
  }

  Image_Information.init({
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Image_Information',
    tableName: 'Image_Information'
  });
  return Image_Information;
};