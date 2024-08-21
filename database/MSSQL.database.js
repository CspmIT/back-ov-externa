const { Sequelize } = require('sequelize')
const configDb = require('../config/config')

SequelizeMorteros = new Sequelize(configDb.procoop.database, configDb.procoop.username, configDb.procoop.password, {
	host: configDb.procoop.host,
	port: configDb.procoop.port,
	dialect: configDb.procoop.dialect,
	dialectOptions: {
		options: {
			encrypt: false,
			enableArithAbort: true,
		},
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	retry: {
		match: [/ECONNRESET/, /ETIMEDOUT/, /EHOSTUNREACH/, /EPIPE/, /ENOTFOUND/, /ESOCKETTIMEDOUT/],
		max: 5,
	},
	logging: console.log,
})

const SequelizeOncativo = new Sequelize(configDb.procoopOncativo.database, configDb.procoopOncativo.username, configDb.procoopOncativo.password, {
	host: configDb.procoopOncativo.host,
	port: configDb.procoopOncativo.port,
	dialect: configDb.procoopOncativo.dialect,
	dialectOptions: {
		options: {
			encrypt: false,
		},
	},
})

module.exports = {
	SequelizeMorteros,
	SequelizeOncativo,
}
