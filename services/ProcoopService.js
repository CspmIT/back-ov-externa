const { QueryTypes, Op } = require('sequelize')
const { SequelizeOncativo } = require('../database/MSSQL.database')
const { db } = require('../models')
// const { createPersonProcoop } = require('./UserService')

const conexionProcoop = async () => {
    try {
        const connection = await SequelizeOncativo.query('SELECT 1 as result')
        console.log(connection)
        return connection
    } catch (error) {
        console.error('ERROR DE PROCOOP:', error)
        throw error
    }
}

const userOncativoGet = async (dni) => {
    try {
        //los 10 primeros
        const query = `SELECT TOP 10 * FROM personas`
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        return result
    } catch (error) {
        console.error('ERROR DE PROCOOP:', error)
    }
}
const personaPorDni = async (dni) => {
    try {
        const query = `SELECT * FROM personas WHERE NUM_DNI = :dni AND TIP_PERSO = 1`
        const result = await SequelizeOncativo.query(query, {
            replacements: { dni: dni },
            type: SequelizeOncativo.QueryTypes.SELECT,
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
        const result = await SequelizeOncativo.query(query, {
            replacements: { cuit: cuit },
            type: SequelizeOncativo.QueryTypes.SELECT,
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
        const result = await SequelizeOncativo.query(query, {
            replacements: { id_procoop: id_procoop },
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        if (result.length === 0) {
            return { error: 'No se encontraron facturas' }
        }
        return result
    } catch (error) {
        console.error('ERROR DE PROCOOP:', error)
    }
}

const findCustomerByCodSoc = async (cod_soc) => {
    try {
        if (!cod_soc) throw new Error('falta pasar el numero de socio')
        const query = `SELECT * FROM Datos_Personales WHERE COD_SOC = :numberCustomer`
        const result = await SequelizeOncativo.query(query, {
            replacements: { numberCustomer: cod_soc },
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        if (result.length === 0) {
            throw new Error(`No se encontro socio con el numero ${cod_soc}`)
        }
        return result
    } catch (error) {
        throw error
    }
}

const Persona_x_COD_SOC = async (numberCustomer) => {
    try {
        if (!numberCustomer) throw new Error('falta pasar el numero de socio')
        const user = await db.Person.findOne({
            where: {
                number_customer: numberCustomer,
                procoop_last_name: { [Op.not]: '' },
            },
        })
        if (user) {
            const formattData = {
                id: user.id,
                APELLIDOS: user.procoop_last_name,
                EMAIL: user.email,
                COD_SIT: user.situation_tax,
                TELEFONO: user.fixed_phone,
                TIP_DNI: user.type_document,
                NUM_DNI: user.number_document,
            }
            return formattData
        }
        const query = `SELECT * FROM socios  WHERE cod_soc = :numberCustomer`
        const result = await SequelizeOncativo.query(query, {
            replacements: { numberCustomer: numberCustomer },
            type: QueryTypes.SELECT,
        })
        if (result.length === 0) {
            throw new Error('No se encontro socio')
        }
        const query2 = `SELECT * FROM personas WHERE COD_PER = ${result[0].COD_PER}`
        const result2 = await SequelizeOncativo.query(query2, {
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
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
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
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
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
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
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
            return { error: 'No se puede realizar la busqueda' }
        }
        const query = `SELECT s.DES_SER, dss.ID_SERSOC,dss.COD_SER,s.DES_SER,dss.COD_CAT,dss.COD_CATSER,dss.NOMBRE_CATEGORIA,ds.COD_SUM,ds.COD_SOC, ds.DESCRI_SITIVA,
                    ds.NOMBRECALLE AS CALLECUENTA,ds.NUMERO AS ALTURACALLECUENTA,ds.PISO AS PISOCUENTA,ds.DPTO AS DPTOCUENTA,dss.NOMBRECALLE AS CALLESERVICIO,
                    dss.NUMERO AS ALTURACALLESERVICIO,dss.PISO AS PISOSERVICIO,dss.DPTO AS DPTOSERVICIO,dss.FEC_ALTA,dss.FEC_BAJA,dss.ALTA_ADM,dss.BAJA_ADM,dss.[NUM_MED/NUMTEL]
                    FROM Datos_Suministro ds
                    INNER JOIN Datos_ServiciosXSuministro dss ON dss.cod_sum = ds.cod_sum
                    INNER JOIN Servicio s ON s.cod_ser = dss.cod_ser
                    WHERE ds.${data.type} = :number ORDER BY ds.cod_sum`
        const result = await SequelizeOncativo.query(query, {
            replacements: { number: data.number },
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        if (result.length === 0) {
            throw new Error('No se encontraron servicios para el socio')
        }
        return result
    } catch (error) {
        throw error
    }
}

const consumoCustomer = async (service, account) => {
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
        const query = `SELECT cod_ser, cod_sum, cod_med, fec_act, consumo, periodo, cod_cat FROM cons_ser 
    WHERE cod_ser = :ser AND fec_act >= :since AND cod_sum = :account`
        const result = await SequelizeOncativo.query(query, {
            replacements: {
                ser: service,
                since: searchSince,
                account: account,
            },
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        if (result.length === 0) {
            throw Error('No se encontraron consumos')
        }
        return result
    } catch (error) {
        return error
    }
}

const accountsCustomer = async (number) => {
    try {
        const query = `SELECT * FROM Datos_Suministro WHERE COD_SOC = :number`
        const result = await SequelizeOncativo.query(query, {
            replacements: { number: number },
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        if (result.length === 0) {
            return { error: 'No se encontró la persona' }
        }
        return result
    } catch (error) {
        console.error('ERROR DE PROCOOP:', error)
    }
}

const debtsCustomer = async (accounts, all = false) => {
    try {
        const query = `SELECT  dd.ID_FAC, dd.COD_COM,  dd.SUC_COM, fa.pagado, dd.NUM_COM, dd.TIPO, dd.FECHA, dd.COD_SOC, dd.COD_PER, dd.COD_SUM,
                  dd.VTO1, dd.TOTAL1, dd.VTO2, dd.TOTAL2, dd.PAGA, dd.FECHASALDO, dd.SALDO, dd.PERIODO, tf.NUMERO, dd.DEB_CRE
                  FROM  datos_deuda dd 
                  LEFT JOIN talonfac tf ON dd.id_fac = tf.Id_Fac
                  INNER JOIN facturas fa ON fa.id_fac = dd.Id_Fac 
                  WHERE dd.COD_SUM IN (:accounts) AND dd.FECHA  >= Dateadd(mm,-13,Getdate()) ${
                      all ? '' : 'AND dd.SALDO != 0'
                  } 
                  ORDER BY FECHA DESC`
        const result = await SequelizeOncativo.query(query, {
            replacements: { accounts },
            type: SequelizeOncativo.QueryTypes.SELECT,
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
        const result = await SequelizeOncativo.query(query, {
            replacements: { account: account },
            type: SequelizeOncativo.QueryTypes.SELECT,
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
                  WHERE	ad.cod_sum = :account AND ad.cod_ser IN (:ser) AND fec_baj IS NULL`
        const result = await SequelizeOncativo.query(query, {
            replacements: {
                account: data.account,
                ser: data.ser
            },
            type: SequelizeOncativo.QueryTypes.SELECT,
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
        const user_procoop = await db.Procoop_Member.findOne({
            where: { num_dni: dni },
        })
        return user_procoop.get()
    } catch (error) {
        throw error
    }
}

const getOrCreateProcoopMember = async (body, user) => {
    return db.sequelize.transaction(async (t) => {
        try {
            const { name_customer, last_name_customer, num_customer } = body
            let PersonProcoop = await db.Person.findOne({
                where: { number_customer: num_customer },
                transaction: t,
            })
            if (!PersonProcoop) {
                const datoUser = await Persona_x_COD_SOC(num_customer)
                if (!datoUser)
                    throw new Error('El numero de socio no es correcto')
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
                const [PersonProcoopControl, createdPerson] =
                    await db.Person.findOrCreate({
                        where: { number_document: dataProcoop.NUM_DNI },
                        defaults: { ...dataProcoopMember },
                        transaction: t,
                    })
                if (!createdPerson) {
                    const dataUpdatePerson = {
                        procoop_last_name: dataProcoop.APELLIDOS,
                        number_customer: num_customer,
                        situation_tax: dataProcoop.COD_SIT,
                        fixed_phone: dataProcoop.TELEFONO,
                    }
                    await PersonProcoopControl.update(dataUpdatePerson, {
                        transaction: t,
                    })
                }
                // DEPENDIENDO DEL TIPO DE PERSONA SE GENERA UN OBJETO CON SUS DATOS Y SE GUARDA EL REGISTRO DE ESA PERSONA.
                // 1 ES PERSONA FISICA, 2 PERSONA LEGAL
                if (dataProcoop.TIP_PERSO === 1) {
                    const dataPersonPhysicalProcoop = {
                        name: name_customer,
                        last_name: last_name_customer,
                        type_dni: dataProcoop.TIP_DNI,
                        num_dni: dataProcoop.NUM_DNI,
                        born_date: dataProcoop.FEC_NAC
                            ? new Date(`${dataProcoop.FEC_NAC} `)
                            : null,
                        blood_type: dataProcoop.GRU_SGR,
                        factor: dataProcoop.FAC_SGR,
                        donor: dataProcoop.DAD_SGR,
                        id_type_sex: dataProcoop.SEXO === 'M' ? 2 : 1,
                        id_person: PersonProcoopControl.id,
                    }
                    // SE CREA LA PERSONA FISICA DE PERSONA DE PROCOOP
                    const [dataPersonPhysical, createdPhysical] =
                        await db.Person_physical.findOrCreate({
                            where: { num_dni: dataProcoop.NUM_DNI },
                            defaults: { ...dataPersonPhysicalProcoop },
                            transaction: t,
                        })
                    if (!createdPhysical) {
                        const dataUpdate = {
                            blood_type:
                                dataPersonPhysical.blood_type ||
                                dataPersonPhysicalProcoop.blood_type,
                            factor:
                                dataPersonPhysical.factor ||
                                dataPersonPhysicalProcoop.factor,
                            donor:
                                dataPersonPhysical.id_type_sex ||
                                dataPersonPhysicalProcoop.id_type_sex,
                        }
                        await dataPersonPhysical.update(dataUpdate, {
                            transaction: t,
                        })
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
                    const [dataPersonLegal, createdLegal] =
                        await db.Person_legal.findOrCreate({
                            where: { cuit: dataPersonLegalProcoop.cuit },
                            defaults: { ...dataPersonLegalProcoop },
                            transaction: t,
                        })
                    if (!createdLegal) {
                        const dataUpdate = {
                            social_raeson:
                                dataPersonLegal.social_raeson ||
                                dataPersonLegalProcoop.social_raeson,
                            fantasy_name:
                                dataPersonLegal.fantasy_name ||
                                dataPersonLegalProcoop.fantasy_name,
                        }
                        await dataPersonLegal.update(dataUpdate, {
                            transaction: t,
                        })
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
            const [relationProcoop, create] = await db.User_People.findOrCreate(
                {
                    where: { id_user: user.id, id_person: PersonProcoop.id },
                    defaults: { ...relationPersonProcoop },
                    transaction: t,
                }
            )
            // EN CASO DE QUE SE ENCUENTRE UN REGISTRO CON ESOS VALORES SE ACTUALIZA EL REGISTRO
            if (!create)
                await relationProcoop.update(relationPersonProcoop, {
                    transaction: t,
                })

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
            const [user_procoopmember, created] =
                await db.User_procoopMember.findOrCreate({
                    where: {
                        id_procoop_member: id_ProcoopMember,
                        id_user: id_user,
                    },
                    default: {
                        id_procoop_member: id_ProcoopMember,
                        id_user: id_user,
                    },
                    transaction: t,
                })
            if (created) {
                const AccountPrimary = await db.User_procoopMember.findOne({
                    where: { id_user: id_user },
                })
                await user_procoopmember.update(
                    {
                        level: 2,
                        primary_account: AccountPrimary ? false : true,
                        status: true,
                    },
                    { transaction: t }
                )
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
        })
        const result = users_procoop.map((user) => user.get({ plain: true }))
        return result
    } catch (error) {
        throw error
    }
}

const getPriceAndDescInternet = async (user = false) => {
    try {
        let query
        if (user === 3) {
            query = `SELECT CS.COD_SER, CS.DES_CAT, CS.COD_CAT, S.DES_SER, CT.DES_CON, CT.PRE_UNI FROM CATE_SER AS CS
						INNER JOIN SERVICIO AS S
						ON CS.COD_SER = S.COD_SER 
						INNER JOIN CATTARIF AS CT
						ON CT.COD_CATSER = CS.COD_CATSER
						WHERE S.COD_SER = 9 
						AND CS.COD_CAT = 149`
        }

        query = `SELECT CS.COD_SER, CS.DES_CAT, CS.COD_CAT, S.DES_SER, CT.DES_CON, CT.PRE_UNI FROM CATE_SER AS CS
						INNER JOIN SERVICIO AS S ON CS.COD_SER = S.COD_SER 
						INNER JOIN CATTARIF AS CT ON CT.COD_CATSER = CS.COD_CATSER
						WHERE S.COD_SER = 9 
						AND CS.COD_CAT = 143 
						OR CS.COD_CAT = 145 
						OR CS.COD_CAT = 159 ${user === 4 ? 'OR CS.COD_CAT = 123' : ''}`
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        return result
    } catch (error) {
        throw error
    }
}

const getPriceAndDescTV = async (user = false) => {
    try {
        let query
        if (user === 3) {
            query = `SELECT CS.COD_SER, CS.DES_CAT, CS.COD_CAT, S.DES_SER, CT.DES_CON, CT.PRE_UNI FROM CATE_SER AS CS
			INNER JOIN SERVICIO AS S
			ON CS.COD_SER = S.COD_SER 
			INNER JOIN CATTARIF AS CT
			ON CT.COD_CATSER = CS.COD_CATSER
			WHERE CS.COD_SER = 117 AND CS.COD_CAT = 4
			OR CS.COD_SER = 84 AND CS.COD_CAT = 1`
        } else {
            query = `
				SELECT CS.COD_SER, CS.DES_CAT, CS.COD_CAT, S.DES_SER, CT.DES_CON, CT.PRE_UNI FROM CATE_SER AS CS
				INNER JOIN SERVICIO AS S
				ON CS.COD_SER = S.COD_SER 
				INNER JOIN CATTARIF AS CT
				ON CT.COD_CATSER = CS.COD_CATSER
				WHERE (S.COD_SER = 55 AND CS.COD_CAT = 1) 
				OR (S.COD_SER = 84 AND CS.COD_CAT = 1) 
				OR (CS.COD_SER = 59 AND CS.COD_CAT = 1)
				OR (CS.COD_SER = 117 AND CS.COD_CAT = 2)
				OR CS.COD_SER = 100 AND CS.COD_CAT = 10`
        }
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        return result
    } catch (error) {
        throw error
    }
}

const getPriceAndDescTelefonia = async (user) => {
    try {
        let cod_cat
        if (user === 1) {
            cod_cat = 1
        } else if (user === 2) {
            cod_cat = 3
        } else if (user === 4) {
            cod_cat = 4
        }
        const query = `SELECT CS.COD_SER, CS.DES_CAT, CS.COD_CAT, S.DES_SER, CT.DES_CON, CT.PRE_UNI FROM CATE_SER AS CS
				INNER JOIN SERVICIO AS S
				ON CS.COD_SER = S.COD_SER 
				INNER JOIN CATTARIF AS CT
				ON CT.COD_CATSER = CS.COD_CATSER
				WHERE S.COD_SER = 10 AND CS.COD_CAT = :cod_cat`
        const result = await SequelizeOncativo.query(query, {
            replacements: { cod_cat: cod_cat },
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        return result
    } catch (error) {
        throw error
    }
}

const getSituations = async () => {
    try {
        const query = `SELECT cod_sit, des_sit, res_sit FROM sitiva where cod_sit not in (2,3)`
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        return result
    } catch (error) {
        throw error
    }
}

const getRelationshipsProcoop = async (id) => {
    try {
        if (id) {
            const query = `SELECT * FROM VINCULOS WHERE cod_vin = :id`
            const result = await SequelizeOncativo.query(query, {
                replacements: { id: id },
                type: SequelizeOncativo.QueryTypes.SELECT,
            })
            return result
        }
        const query = `SELECT * FROM VINCULOS`
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
        return result
    } catch (error) {
        throw error
    }
}

async function getAllProcoop() {
    try {
        const query = `SELECT * FROM Datos_Personales`
        const result = await SequelizeOncativo.query(query, {
            type: SequelizeOncativo.QueryTypes.SELECT,
        })
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
    accountsCustomer,
    debtsCustomer,
    phoneCustomer,
    adheridosSS,
    getProcoopMemberxDni,
    getDataProcoopxId,
    allAccount,
    getOrCreateProcoopMember,
    getOrCreateUser_ProcoopMember,
    findCustomerByCodSoc,
}
