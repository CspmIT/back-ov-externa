// const { DataTypes } = require('sequelize')
// const { sequelizeCoopm_v1 } = require('../database/MySQL.database.js')

// const UserDesarrollo = sequelizeCoopm_v1.define(
//     'User',
//     {
//         first_name: DataTypes.STRING,
//         last_name: DataTypes.STRING,
//         number_customer: DataTypes.STRING,
//         email: DataTypes.STRING,
//         password: DataTypes.STRING,
//         document_type: DataTypes.INTEGER,
//         document_number: DataTypes.STRING,
//         sex: DataTypes.INTEGER,
//         phone: DataTypes.STRING,
//         id_state: DataTypes.INTEGER,
//         id_cities: DataTypes.INTEGER,
//         address: DataTypes.STRING,
//         birthday: DataTypes.DATE,
//         date_input: DataTypes.DATE,
//         date_lvl_up_2: DataTypes.DATE,
//         level: DataTypes.INTEGER,
//         email_key: DataTypes.INTEGER,
//         key_validate: DataTypes.INTEGER,
//         key_email_password: DataTypes.INTEGER,
//         img: DataTypes.STRING,
//         popup: DataTypes.INTEGER,
//         dark: DataTypes.INTEGER,
//         date_level_three: DataTypes.DATE,
//         check_lvl_3: DataTypes.INTEGER,
//         check_prepaga: DataTypes.INTEGER,
//         whatsapp: DataTypes.STRING,
//         check_coopate: DataTypes.INTEGER,
//         update_pass: DataTypes.INTEGER,
//         date_update_pass: DataTypes.DATE
//     },
//     {
//         tableName: 'user_customer',
//         timestamps: false
//     }
// )

// module.exports = UserDesarrollo
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class UserDesarrollo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserDesarrollo.init(
        {
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            number_customer: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            document_type: DataTypes.INTEGER,
            document_number: DataTypes.STRING,
            sex: DataTypes.INTEGER,
            phone: DataTypes.STRING,
            id_state: DataTypes.INTEGER,
            id_cities: DataTypes.INTEGER,
            address: DataTypes.STRING,
            birthday: DataTypes.DATE,
            date_input: DataTypes.DATE,
            date_lvl_up_2: DataTypes.DATE,
            level: DataTypes.INTEGER,
            email_key: DataTypes.INTEGER,
            key_validate: DataTypes.INTEGER,
            key_email_password: DataTypes.INTEGER,
            img: DataTypes.STRING,
            popup: DataTypes.INTEGER,
            dark: DataTypes.INTEGER,
            date_level_three: DataTypes.DATE,
            check_lvl_3: DataTypes.INTEGER,
            check_prepaga: DataTypes.INTEGER,
            whatsapp: DataTypes.STRING,
            check_coopate: DataTypes.INTEGER,
            update_pass: DataTypes.INTEGER,
            date_update_pass: DataTypes.DATE
        },
        {
            sequelize,
            tableName: 'user_customer',
            timestamps: false,
            modelName: 'UserDesarrollo'
        }
    )
    return UserDesarrollo
}
