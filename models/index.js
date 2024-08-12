'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'coopm_v2'
const config = require(__dirname + '/../config/config.json')[env]
// const config_v1 = require(__dirname + '/../config/config.json')['coopm_v1']
const db = {}
// const db_coopm_v1 = {}

let sequelize
// let sequelize2
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config)
	// sequelize2 = new Sequelize(config_v1.database, config_v1.username, config_v1.password, config_v1)
}
fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
		// const model2 = require(path.join(__dirname, file))(sequelize2, Sequelize.DataTypes)
		db[model.name] = model
		// db_coopm_v1[model2.name] = model2
	})

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})
// Object.keys(db_coopm_v1).forEach((modelName) => {
// 	if (db_coopm_v1[modelName].associate) {
// 		db_coopm_v1[modelName].associate(db_coopm_v1)
// 	}
// })

db.Sequelize = Sequelize
db.sequelize = sequelize
// db_coopm_v1.sequelize = sequelize2
// db_coopm_v1.Sequelize = Sequelize

const changeSchema = async (schemaName) => {
	const sequelize = new Sequelize(schemaName, config.username, config.password, config)
	fs.readdirSync(__dirname)
		.filter((file) => {
			return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1
		})
		.forEach((file) => {
			const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
			// const model2 = require(path.join(__dirname, file))(sequelize2, Sequelize.DataTypes)
			db[model.name] = model
			// db_coopm_v1[model2.name] = model2
		})

	Object.keys(db).forEach((modelName) => {
		if (db[modelName].associate) {
			db[modelName].associate(db)
		}
	})
	db.sequelize = sequelize
	db.Sequelize = Sequelize
}

module.exports = { db, changeSchema }
