const { db } = require('../models')
const { Op } = require('sequelize')
const listState = async () => {
	try {
		const data = await db.State.findAll()
		return data
	} catch (error) {
		return { error: error.message }
	}
}
const listCity = async (id) => {
	try {
		const data = await db.City.findAll({ where: { cod_pci: id } })
		return data
	} catch (error) {
		return { error: error.message }
	}
}
/**
 * Añade una nueva calle o crea una relación entre una calle existente y una ciudad.
 *
 * @param {Object} data - Objeto de datos para la creación de la calle.
 * @param {number} data.id_api - El ID de la API externa para la calle.
 * @param {number} data.idCity - El ID de la ciudad asociada con la calle.
 * @param {string} data.name - El nombre de la calle.
 * @returns {Promise<Object>} Un objeto que representa la calle creada o la relación establecida.
 *
 * Esta función realiza una transacción utilizando Sequelize. Dentro de la transacción:
 * 1. Busca si ya existe una calle con el mismo `id_api` y un nombre similar al proporcionado.
 * 2. Si la calle existe, intenta encontrar una relación entre la calle y la ciudad.
 * 3. Si la relación existe, lanza un error indicando que la calle ya existe en la base de datos.
 * 4. Si la relación no existe, crea una nueva relación en la tabla `Street_City`.
 * 5. Si la calle no existe, crea una nueva calle y luego establece la relación con la ciudad.
 *
 * La función maneja errores internos y devuelve un objeto de error si ocurre alguno.
 */
const addStreetAPi = async (data) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const { id_api, idCity, name } = data
			const existingStreet = await db.Street.findOne(
				{
					where: {
						id_api: id_api,
						name: {
							[Op.like]: `%${name}%`,
						},
					},
				},
				{ transaction: t }
			)
			if (existingStreet) {
				const existingRelation = await db.Street_City.findOne({ where: { id_city: parseInt(idCity), id_street: parseInt(existingStreet.id) } }, { transaction: t })
				if (existingRelation) {
					throw new Error('Esta Calle ya existe en nuestra base de datos')
				} else {
					return await db.Street_City.create({ status: true, id_street: parseInt(existingStreet.id), id_city: parseInt(idCity) }, { transaction: t })
				}
			} else {
				const newStreet = await db.Street.create({ name: name, id_api: parseInt(id_api), id_procoop: null }, { transaction: t })
				return await db.Street_City.create({ status: true, id_street: parseInt(newStreet.id), id_city: parseInt(idCity) }, { transaction: t })
			}
		} catch (error) {
			return { error: error.message }
		}
	})
}
const addStreetProcoop = async (data) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const { id_procoop, id_city, name } = data
			const existingStreet = await db.Street.findOne(
				{
					where: {
						id_procoop: id_procoop,
						name: {
							[Op.like]: `%${name}%`,
						},
					},
				},
				{ transaction: t }
			)
			if (existingStreet) {
				const existingRelation = await db.Street_City.findOne({ where: { id_city: parseInt(id_city), id_street: parseInt(existingStreet.id) } }, { transaction: t })
				if (existingRelation) {
					throw new Error('Esta Calle ya existe en nuestra base de datos')
				} else {
					return await db.Street_City.create({ status: true, id_street: parseInt(existingStreet.id), id_city: parseInt(id_city) }, { transaction: t })
				}
			} else {
				console.log('HOlaaaaaa')
				const newStreet = await db.Street.create({ name: name, id_api: null, id_procoop: parseInt(id_procoop) }, { transaction: t })
				const relation = await db.Street_City.create({ status: true, id_street: parseInt(newStreet.id), id_city: parseInt(id_city) }, { transaction: t })
				return relation
			}
		} catch (error) {
			return { error: error.message }
		}
	})
}

const listStreetsByCity = async (cityId) => {
	try {
		const streets = await db.Street.findAll({
			include: [
				{
					association: 'Cities',
					where: { id: cityId },
					// through: {
					// 	model: db.Street_City,
					// 	as: 'StreetCities',
					// },
					attributes: ['id', 'DES_LOC'],
				},
			],
			raw: true,
			nest: true,
		})
		return streets
	} catch (error) {
		return { error: error.message }
	}
}
const searchAddress = async (data) => {
	try {
		const Addresses = await db.Address.findOne({ where: { number_address: data.number_address, StreetId: data.StreetId, CityId: data.CityId, StateID: data.StateID } })
		return Addresses
	} catch (error) {
		return { error: error.message }
	}
}
/**
 * Busca la dirección asociada con un usuario específico.
 *
 * @param {number} id_user - El ID del usuario para el cual se busca la dirección.
 * @returns {Promise<Object|null>} Un objeto que representa la dirección encontrada o null si no hay ninguna.
 *
 * La función realiza las siguientes operaciones:
 * 1. Busca una entrada en la tabla `Person_Address` donde el `UserId` coincida con `id_user`.
 * 2. Si no encuentra una entrada, devuelve null, indicando que no hay una dirección asociada.
 * 3. Si encuentra una entrada, procede a buscar la dirección completa.
 * 4. Realiza una búsqueda en la tabla `Address` e incluye los modelos relacionados `City`, `Street`, y `State`.
 * 5. Utiliza el método `findOne` para obtener una sola dirección que coincida con los criterios.
 * 6. Devuelve la dirección encontrada con un formato anidado debido a las opciones `raw` y `nest`.
 *
 * En caso de error durante la consulta, captura la excepción y devuelve un objeto de error.
 *
 */
const searchAddressxUser = async (id_user) => {
	try {
		const Person_Address = await db.Person_Address.findOne({ where: { [Op.or]: [{ PersonPhysicalId: id_user }, { PersonLegalsId: id_user }] } })
		if (!Person_Address) {
			return Person_Address
		}
		const Addresses = await db.Address.findOne({
			include: [
				{
					model: db.City,
					as: 'City',
					where: { id: db.Sequelize.col('Address.CityId') },
				},
				{
					model: db.Street,
					as: 'Street',
					where: { id: db.Sequelize.col('Address.StreetId') },
				},
				{
					model: db.State,
					as: 'State',
					where: { id: db.Sequelize.col('Address.StateId') },
				},
			],
			raw: true,
			nest: true,
		})

		return Addresses
	} catch (error) {
		return { error: error.message }
	}
}
const saveAdrress = (dataAddress) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const [Address, created] = await db.Address.findOrCreate({
				where: { id_street: dataAddress.id_street, id_city: dataAddress.id_city, id_state: dataAddress.id_state, number_address: dataAddress.number_address },
				defaults: { ...dataAddress },
				transaction: t,
			})
			if (!created) {
				await Address.update(dataAddress, { transaction: t })
			}
			return Address
		} catch (error) {
			throw error
		}
	})
}
const savePersonAdrress = (dataRelation) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const [personAddress, created] = await db.Person_Address.findOrCreate({
				where: { id_person: dataRelation.id_person, id_address: dataRelation.id_address },
				defaults: { ...dataRelation },
				transaction: t,
			})
			if (!created) {
				await personAddress.update({ status: 1 })
			}
			const addresses = await db.Person_Address.findAll({ where: { id_person: dataRelation.id_person } })
			// Actualizamos el estado de todas las demás direcciones asociadas a la persona
			const updatePromises = addresses.map((element) => {
				if (element.dataValues.id !== personAddress.dataValues.id) {
					return db.Person_Address.update({ status: 0 }, { where: { id: element.dataValues.id }, transaction: t })
				}
			})

			await Promise.all(updatePromises)

			return personAddress
		} catch (error) {
			throw error
		}
	})
}
module.exports = { listState, listCity, listStreetsByCity, addStreetAPi, addStreetProcoop, searchAddress, searchAddressxUser, saveAdrress, savePersonAdrress }
