'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class minio extends Model {
        static associate(models) {}
    }
    minio.init(
        {
            bucket: DataTypes.STRING,
            accessKey: DataTypes.STRING,
            secretKey: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'minio',
            tableName: 'minio',
            timestamps: false,
        }
    )
    return minio
}
