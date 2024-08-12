const { Sequelize, QueryTypes } = require('sequelize')
const config = require('../config/config.json')

// const sequelizeCoopm_v1 = new Sequelize(config.coopm_v1.database, config.coopm_v1.username, config.coopm_v1.password, {
//     host: config.coopm_v1.host,
//     port: config.coopm_v1.port,
//     dialect: config.coopm_v1.dialect
// })
const sequelizeCoopm_v2 = new Sequelize(config.coopm_v2.database, config.coopm_v2.username, config.coopm_v2.password, {
	host: config.coopm_v2.host,
	port: config.coopm_v2.port,
	dialect: config.coopm_v2.dialect,
})

async function testConnection() {
	try {
		await sequelizeCoopm_v1.authenticate()
		await sequelizeCoopm_v2.authenticate()
		console.log('Connection has been established successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

module.exports = {
	// sequelizeCoopm_v1,
	sequelizeCoopm_v2,
	QueryTypes,
	testConnection,
}
