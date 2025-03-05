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
            this.belongsTo(models.Person, {
                foreignKey: 'id_person',
                targetKey: 'id',
                as: 'People',
            })
            this.belongsTo(models.User, { foreignKey: 'id_user', as: 'Users' })
            this.belongsTo(models.User, {
                foreignKey: 'responsible',
                as: 'Responsible',
            })
            this.hasMany(models.Service_Items, {
                foreignKey: 'id_service_request',
                as: 'ServiceItems',
            })
        }
    }
    Service_Request.init(
        {
            id_person: DataTypes.INTEGER,
            id_user: { type: DataTypes.INTEGER, allowNull: false },
            status: { type: DataTypes.TINYINT, allowNull: false },
            return_later: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: false,
            },
            step: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            person_data: { type: DataTypes.JSON, allowNull: true },
            responsible: { type: DataTypes.STRING, allowNull: true },
        },
        {
            sequelize,
            modelName: 'Service_Request',
        }
    )
    return Service_Request
}
