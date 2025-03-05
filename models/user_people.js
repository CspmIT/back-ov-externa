'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class User_People extends Model {
        static associate(models) {
            User_People.belongsTo(models.User, {
                foreignKey: 'id_user',
                as: 'User',
            })
        }
    }
    User_People.init(
        {
            id_user: DataTypes.INTEGER,
            procoop_number: DataTypes.BIGINT,
            procoop_last_name: DataTypes.STRING,
            level: DataTypes.INTEGER,
            primary_account: DataTypes.BOOLEAN,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'User_People',
        }
    )
    return User_People
}
