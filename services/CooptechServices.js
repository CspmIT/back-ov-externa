const { db } = require('../models')
const { formatDate } = require('../utils/date/date')
const updateEmployed = async (id_person, profile) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const personPhysical = await db.Person_physical.findOne({ where: { id_person: id_person } })
			const dataEmployed = {
				id_person_physical: personPhysical.id,
				profile: profile,
			}
			const [Employed, created] = await db.Employee.findOrCreate({ where: { id_person_physical: personPhysical.id }, defaults: { ...dataEmployed }, transaction: t })
			if (!created) {
				await Employed.update({ profile: profile }, { transaction: t })
			}
			return Employed
		} catch (error) {
			throw error
		}
	})
}
const addUserCooptech = async (data) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const dataUser = {
				name_register: data.name,
				last_name_register: data.last_name,
				email: data.email,
				// user_type: 1,
				token_app: data.token,
				type_person: 1,
				email_verified: formatDate(new Date().toLocaleDateString()),
			}
			const [User, createdUser] = await db.User.findOrCreate({ where: { email: dataUser.email }, defaults: { ...dataUser }, transaction: t })
			if (!createdUser) {
				const dataUpdate = {
					// user_type: 1,
					token_app: data.token,
				}
				await User.update(dataUpdate, { transaction: t })
			}

			if (!User.id_person_profile) {
				const personCreate = {
					email: data.email,
					type_person: 1,
					type_document: 1,
					number_document: data.dni,
				}
				const [Person, createdPerson] = await db.Person.findOrCreate({ where: { number_document: personCreate.number_document }, defaults: { ...personCreate }, transaction: t })
				if (createdPerson) {
					const dataPersonPhysical = {
						name: data.name,
						last_name: data.last_name,
						tpe_dni: 1,
						num_dni: data.dni,
						id_type_sex: data.type_sex,
						id_person: Person.id,
					}
					await db.Person_physical.create(dataPersonPhysical, { transaction: t })
				}
				const dataUpdate = {
					id_person_profile: Person.id,
				}
				await User.update(dataUpdate, { transaction: t })
				await updateEmployed(Person.id, data.profile)
			} else {
				await updateEmployed(User.id_person_profile, data.profile)
			}
			return User
		} catch (error) {
			throw error
		}
	})
}

module.exports = {
	addUserCooptech,
}
