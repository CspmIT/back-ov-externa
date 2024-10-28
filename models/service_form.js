'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Service_Form extends Model {
        static associate(models) {
            // se relaciona un item con un formulario
            this.hasMany(models.Service_Items, {
                foreignKey: 'id_service_form',
                as: 'items',
            })

            this.belongsTo(models.Person_Address, {
                foreignKey: 'id_connection_address',
                as: 'connection_address',
            })
        }
    }

    Service_Form.init(
        {
            type_activity: { type: DataTypes.TINYINT, allowNull: true },
            id_files_form: { type: DataTypes.INTEGER, allowNull: true },
            id_connection_address: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            form_data: { type: DataTypes.JSON, allowNull: true },
            connection_address_tmp: { type: DataTypes.JSON, allowNull: true },
        },
        {
            sequelize,
            modelName: 'Service_Form',
            tableName: 'Service_Form',
        }
    )
    return Service_Form
}
