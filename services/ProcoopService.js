const { QueryTypes } = require('sequelize')
const { SequelizeMorteros } = require('../database/MSSQL.database')
const { db } = require('../models')
// const { createPersonProcoop } = require('./UserService')

const conexionProcoop = async () => {
	try {
		await SequelizeMorteros.authenticate()
		console.log('CONEXIÓN EXITOSA')
	} catch (error) {
		console.error('ERROR DE MIERDACOOP:', error)
	}
}

const personaPorDni = async (dni) => {
	try {
		const query = `SELECT * FROM personas WHERE NUM_DNI = :dni AND TIP_PERSO = 1`
		const result = await SequelizeMorteros.query(query, {
			replacements: { dni: dni },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
		throw error.message
	}
}

const empresaPorCuit = async (cuit) => {
	try {
		const query = `SELECT * FROM personas WHERE NUM_DNI = :cuit AND TIP_PERSO = 2`
		const result = await SequelizeMorteros.query(query, {
			replacements: { cuit: cuit },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la empresa' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const invoicesXsocio = async (id_procoop) => {
	try {
		const query = `SELECT * FROM facturas WHERE id_procoop = :id_procoop`
		const result = await SequelizeMorteros.query(query, {
			replacements: { id_procoop: id_procoop },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontraron facturas' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const Persona_x_COD_SOC = async (numberCustomer) => {
	try {
		if (!numberCustomer) throw new Error('falta pasar el numero de socio')
		const user = await db.Person.findOne({ where: { number_customer: numberCustomer }, include: [{ association: 'Person_physical' }, { association: 'Person_legal' }] })
		if (user) return user.get()
		const query = `SELECT * FROM socios  WHERE cod_soc = :numberCustomer`
		const result = await SequelizeMorteros.query(query, {
			replacements: { numberCustomer: numberCustomer },
			type: QueryTypes.SELECT,
		})
		if (result.length === 0) {
			throw new Error('No se encontro socio')
		}
		const query2 = `SELECT * FROM personas WHERE COD_PER = ${result[0].cod_per}`
		const result2 = await SequelizeMorteros.query(query2, {
			type: QueryTypes.SELECT,
		})
		if (result2.length === 0) {
			throw new Error('No se encontro Persona con ese numero de socio')
		}
		return result2
	} catch (error) {
		throw error
	}
}

const ListStreetProcoop = async () => {
	try {
		const query = `SELECT * FROM calles`
		const result = await SequelizeMorteros.query(query, {
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la ciudad' }
		}
		return result
	} catch (error) {
		throw error
	}
}

const ListCityProcoop = async () => {
	try {
		const query = `SELECT * FROM localida`
		const result = await SequelizeMorteros.query(query, {
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la ciudad' }
		}
		return result
	} catch (error) {
		throw error
	}
}

const ListStateProcoop = async () => {
	try {
		const query = `SELECT * FROM PROVINC`
		const result = await SequelizeMorteros.query(query, {
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			// Retorno un objeto con un mensaje de error
			return { error: 'No se encontró la provincia' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const serviceCustomer = async (data) => {
	try {
		if (data.type !== 'COD_SOC' && data.type !== 'cod_sum') {
			return { error: 'No se encontró la persona' }
		}
		const query = `SELECT s.DES_SER, dss.ID_SERSOC,dss.COD_SER,s.DES_SER,dss.COD_CAT,dss.COD_CATSER,dss.NOMBRE_CATEGORIA,ds.COD_SUM,ds.COD_SOC, ds.DESCRI_SITIVA,
                    ds.NOMBRECALLE AS CALLECUENTA,ds.NUMERO AS ALTURACALLECUENTA,ds.PISO AS PISOCUENTA,ds.DPTO AS DPTOCUENTA,dss.NOMBRECALLE AS CALLESERVICIO,
                    dss.NUMERO AS ALTURACALLESERVICIO,dss.PISO AS PISOSERVICIO,dss.DPTO AS DPTOSERVICIO,dss.FEC_ALTA,dss.FEC_BAJA,dss.ALTA_ADM,dss.BAJA_ADM,dss.[NUM_MED/NUMTEL]
                    FROM Datos_Suministro ds
                    INNER JOIN Datos_ServiciosXSuministro dss ON dss.cod_sum = ds.cod_sum
                    INNER JOIN Servicio s ON s.cod_ser = dss.cod_ser
                    WHERE ds.${data.type} = :number ORDER BY ds.cod_sum`
		const result = await SequelizeMorteros.query(query, {
			replacements: { number: data.number },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const consumoCustomer = async (data) => {
	try {
		const actualDate = new Date()
		let lastMonth = actualDate.getMonth()
		let lastYear = actualDate.getFullYear() - 1
		if (lastMonth == 0) {
			lastMonth = 12
			lastYear -= 1
		}
		if (lastMonth < 10) {
			lastMonth = `0${lastMonth}`
		}
		const searchSince = `${lastMonth}/01/${lastYear}`
		const query = `SELECT cod_ser, cod_sum, cod_med, fec_act, consumo, periodo, cod_cat,facturado, est_act FROM cons_ser 
    WHERE cod_ser = :ser AND fec_act >= :since AND cod_sum = :account`
		const result = await SequelizeMorteros.query(query, {
			replacements: { ser: data.ser, since: searchSince, account: data.account },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

const debtsCustomer = async (number, all = false) => {
	try {
		const query = `SELECT  dd.ID_FAC, dd.COD_COM,  dd.SUC_COM, fa.pagado, dd.NUM_COM, dd.TIPO, dd.FECHA, dd.COD_SOC, dd.COD_PER, dd.COD_SUM,
                  dd.VTO1, dd.TOTAL1, dd.VTO2, dd.TOTAL2, dd.PAGA, dd.FECHASALDO, dd.SALDO, dd.PERIODO, tf.NUMERO, dd.DEB_CRE
                  FROM  pr_mt_nueva_demo.dbo.datos_deuda dd 
                  LEFT JOIN pr_mt_nueva_demo.dbo.talonfac tf ON dd.id_fac = tf.Id_Fac
                  INNER JOIN pr_mt_nueva_demo.dbo.facturas fa ON fa.id_fac = dd.Id_Fac 
                  WHERE dd.cod_soc = :number AND dd.FECHA  >= Dateadd(mm,-13,Getdate()) ${all ? '' : 'AND dd.SALDO != 0'} 
                  ORDER BY FECHA DESC`
		const result = await SequelizeMorteros.query(query, {
			replacements: { number: number },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		return result
	} catch (error) {
		throw error
	}
}

const phoneCustomer = async (account) => {
	try {
		const query = `SELECT ID_SERSOC, COD_SUM, COD_SER, COD_CAT, [NUM_MED/NUMTEL]
                  FROM Datos_ServiciosXSuministro WHERE COD_SUM = :account AND cod_ser = 10 AND fec_baja IS NULL`
		const result = await SequelizeMorteros.query(query, {
			replacements: { account: account },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}
const adheridosSS = async (data) => {
	try {
		const query = `SELECT ad.cod_ser, s.des_ser, ad.cod_sum, ad.cod_soc, ad.fec_alt,
                  ad.fec_baj, d.des_doc, pe.num_dni, ad.cod_per, pe.apellidos, pe.fec_nac, pe.cod_cal, 
                  ca.des_cal, pe.numero, pe.piso, pe.dpto, pe.gru_sgr, pe.fac_sgr, vi.des_vin
                  FROM adhsoc ad
                  LEFT JOIN	personas pe ON ad.cod_per = pe.cod_per 
                  LEFT JOIN	vinculos vi ON ad.cod_vin = vi.cod_vin 
                  LEFT JOIN	calles ca ON pe.cod_cal = ca.cod_cal 
                  LEFT JOIN	document d ON pe.tip_dni = d.cod_doc 
                  LEFT JOIN	servicio s ON ad.cod_ser = s.cod_ser
                  WHERE	ad.cod_sum = :account AND ad.cod_ser IN (:ser1, :ser2) AND fec_baj IS NULL`
		const result = await SequelizeMorteros.query(query, {
			replacements: { account: data.account, ser1: data.ser[0], ser2: data.ser[1] },
			type: SequelizeMorteros.QueryTypes.SELECT,
		})
		if (result.length === 0) {
			return { error: 'No se encontró la persona' }
		}
		return result
	} catch (error) {
		console.error('ERROR DE PROCOOP:', error)
	}
}

//Funciones en tablas en db nueva
const getProcoopMemberxDni = async (dni) => {
	try {
		const user_procoop = await db.Procoop_Member.findOne({ where: { num_dni: dni } })
		return user_procoop.get()
	} catch (error) {
		throw error
	}
}

const getOrCreateProcoopMember = async (body, user) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const { name_customer, last_name_customer, num_customer } = body
			let PersonProcoop = await db.Person.findOne({ where: { number_customer: num_customer }, transaction: t })
			if (!PersonProcoop) {
				const datoUser = await Persona_x_COD_SOC(num_customer)
				if (!datoUser) throw new Error('El numero de socio no es correcto')
				let dataProcoop = datoUser[0]
				// SE GENERA UN OBJETO DONDE TENGA TODO LOS VALORES DE PROCOOP, PARA QUE EN CASO DE QUE NO EXISTA CREARLO
				const dataProcoopMember = {
					procoop_last_name: dataProcoop.APELLIDOS,
					email: dataProcoop.EMAIL,
					number_customer: num_customer,
					type_person: dataProcoop.TIP_PERSO,
					situation_tax: dataProcoop.COD_SIT,
					fixed_phone: dataProcoop.TELEFONO,
					type_document: dataProcoop.TIP_DNI,
					number_document: dataProcoop.NUM_DNI,
				}

				// SE CREA LA PERSONA CON LOS DATOS DE PROCOOP
				const [PersonProcoopControl, createdPerson] = await db.Person.findOrCreate({ where: { number_document: dataProcoop.NUM_DNI }, defaults: { ...dataProcoopMember }, transaction: t })
				if (!createdPerson) {
					const dataUpdatePerson = {
						procoop_last_name: dataProcoop.APELLIDOS,
						number_customer: num_customer,
						situation_tax: dataProcoop.COD_SIT,
						fixed_phone: dataProcoop.TELEFONO,
					}
					await PersonProcoopControl.update(dataUpdatePerson, { transaction: t })
				}
				// DEPENDIENDO DEL TIPO DE PERSONA SE GENERA UN OBJETO CON SUS DATOS Y SE GUARDA EL REGISTRO DE ESA PERSONA.
				// 1 ES PERSONA FISICA, 2 PERSONA LEGAL
				if (dataProcoop.TIP_PERSO === 1) {
					const dataPersonPhysicalProcoop = {
						name: name_customer,
						last_name: last_name_customer,
						type_dni: dataProcoop.TIP_DNI,
						num_dni: dataProcoop.NUM_DNI,
						born_date: new Date(`${dataProcoop.FEC_NAC} `),
						blood_type: dataProcoop.GRU_SGR,
						factor: dataProcoop.FAC_SGR,
						donor: dataProcoop.DAD_SGR,
						id_type_sex: dataProcoop.SEXO === 'M' ? 2 : 1,
						id_person: PersonProcoopControl.id,
					}
					// SE CREA LA PERSONA FISICA DE PERSONA DE PROCOOP
					const [dataPersonPhysical, createdPhysical] = await db.Person_physical.findOrCreate({ where: { num_dni: dataProcoop.NUM_DNI }, defaults: { ...dataPersonPhysicalProcoop }, transaction: t })
					if (!createdPhysical) {
						const dataUpdate = {
							blood_type: dataPersonPhysical.blood_type || dataPersonPhysicalProcoop.blood_type,
							factor: dataPersonPhysical.factor || dataPersonPhysicalProcoop.factor,
							donor: dataPersonPhysical.id_type_sex || dataPersonPhysicalProcoop.id_type_sex,
						}
						await dataPersonPhysical.update(dataUpdate, { transaction: t })
					}
				} else {
					const dataPersonLegalProcoop = {
						social_raeson: name_customer,
						fantasy_name: last_name_customer,
						cuit: dataProcoop.NUM_DNI,
						date_registration: new Date(`${dataProcoop.FEC_NAC} `),
						id_person: PersonProcoopControl.id,
					}
					// SE CREA LA PERSONA LEGAL DE PERSONA DE PROCOOP
					const [dataPersonLegal, createdLegal] = await db.Person_legal.findOrCreate({ where: { cuit: dataPersonLegalProcoop.cuit }, defaults: { ...dataPersonLegalProcoop }, transaction: t })
					if (!createdLegal) {
						const dataUpdate = {
							social_raeson: dataPersonLegal.social_raeson || dataPersonLegalProcoop.social_raeson,
							fantasy_name: dataPersonLegal.fantasy_name || dataPersonLegalProcoop.fantasy_name,
						}
						await dataPersonLegal.update(dataUpdate, { transaction: t })
					}
				}
				PersonProcoop = PersonProcoopControl
			}
			// SE CREA UN OBJETO PARA LA RELACION DE PERSON Y USER EN LA TABLA DE USER_PEOPLE
			const relationPersonProcoop = {
				id_person: PersonProcoop.id,
				id_user: user.id,
				level: 2,
				primary_account: false,
				status: true,
			}
			// SE BUSCA Y CREA UN REGISTRO DE USER_PEOPLE SEGUN EL ID DEL USUARIO
			const [relationProcoop, create] = await db.User_People.findOrCreate({ where: { id_user: user.id, id_person: PersonProcoop.id }, defaults: { ...relationPersonProcoop }, transaction: t })
			// EN CASO DE QUE SE ENCUENTRE UN REGISTRO CON ESOS VALORES SE ACTUALIZA EL REGISTRO
			if (!create) await relationProcoop.update(relationPersonProcoop, { transaction: t })

			const dataResult = {
				id_relation: relationProcoop.id,
				name: PersonProcoop.procoop_last_name,
				num: PersonProcoop.number_customer,
				primary: relationProcoop.primary_account,
				level: relationProcoop.level,
			}
			return dataResult
		} catch (error) {
			throw error
		}
	})
}

const getOrCreateUser_ProcoopMember = async (id_ProcoopMember, id_user) => {
	return db.sequelize.transaction(async (t) => {
		try {
			const [user_procoopmember, created] = await db.User_procoopMember.findOrCreate({
				where: { id_procoop_member: id_ProcoopMember, id_user: id_user },
				default: { id_procoop_member: id_ProcoopMember, id_user: id_user },
				transaction: t,
			})
			if (created) {
				const AccountPrimary = await db.User_procoopMember.findOne({ where: { id_user: id_user } })
				await user_procoopmember.update({ level: 2, primary_account: AccountPrimary ? false : true, status: true }, { transaction: t })
			}
			return user_procoopmember
		} catch (error) {
			throw error
		}
	})
}
const getDataProcoopxId = async (id) => {
	try {
		const user_procoop = await db.Person.findByPk(id)
		return user_procoop.get()
	} catch (error) {
		throw error
	}
}
const allAccount = async (id) => {
	try {
		const users_procoop = await db.User_People.findAll({
			where: { id_user: id },
			include: [
				{
					association: 'data_Person',
				},
			],
		})
		const result = users_procoop.map((user) => user.get({ plain: true }))
		return result
	} catch (error) {
		throw error
	}
}

module.exports = {
	personaPorDni,
	empresaPorCuit,
	conexionProcoop,
	invoicesXsocio,
	Persona_x_COD_SOC,
	ListStreetProcoop,
	ListCityProcoop,
	ListStateProcoop,
	serviceCustomer,
	consumoCustomer,
	debtsCustomer,
	phoneCustomer,
	adheridosSS,
	getProcoopMemberxDni,
	getDataProcoopxId,
	allAccount,
	getOrCreateProcoopMember,
	getOrCreateUser_ProcoopMember,
}
