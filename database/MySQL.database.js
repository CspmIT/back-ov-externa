const { Sequelize, QueryTypes } = require('sequelize')
const config = require('../config/config')

// const sequelizeCoopm_v1 = new Sequelize(config.coopm_v1.database, config.coopm_v1.username, config.coopm_v1.password, {
//     host: config.coopm_v1.host,
//     port: config.coopm_v1.port,
//     dialect: config.coopm_v1.dialect
// })
const sequelizeOv_cesopol = new Sequelize(
    config.ov_cesopol.database,
    config.ov_cesopol.username,
    config.ov_cesopol.password,
    {
        host: config.ov_cesopol.host,
        port: config.ov_cesopol.port,
        dialect: config.ov_cesopol.dialect,
    }
)

async function testConnection() {
    try {
        await sequelizeOv_cesopol.authenticate()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = {
    // sequelizeCoopm_v1,
    sequelizeOv_cesopol,
    QueryTypes,
    testConnection,
}
