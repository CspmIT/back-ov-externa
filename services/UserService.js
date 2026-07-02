const { Op, where } = require('sequelize')
const { db } = require('../models')
const { formatDate } = require('../utils/date/date')
const { Persona_x_COD_SOC, findCustomerByCodSoc } = require('./ProcoopService')
const { procoop } = require('../config/config')

const getUserxId = async (id) => {
    try {
        const user = await db.User.findOne({ where: { id: id } })
        if (!user) throw new Error('El email no existe')
        return user
    } catch (error) {
        throw error
    }
}
const getUserxEmail = async (email) => {
    try {
        const user = await db.User.findOne({ where: { email: email } })
        if (!user) throw new Error('El email no existe')
        return user
    } catch (error) {
        throw error
    }
}
const setTokenTemporal = async (id, tokenTemp) => {
    try {
        const user = await db.User.findOne({ where: { id: id } })
        if (!user) throw new Error('El usuario no existe')
        await user.update({ token_temp: tokenTemp })
        return user
    } catch (error) {
        throw error
    }
}
const verifyEmailToken = async (tokenTemp, id) => {
    try {
        const user = await db.User.findOne({
            where: { id: id, token_temp: tokenTemp },
        })
        if (!user) throw new Error('El token expiro o no existe')
        return user
    } catch (error) {
        throw error
    }
}
const RegisterAcept = async (user) => {
    try {
        await user.update({
            email_verified: new Date(Date.now()),
            token_temp: null,
        })
        return true
    } catch (error) {
        throw error
    }
}
const getUser = async (id) => {
    try {
        const data = await db.User.findOne({ where: { id, status: 1 } })
        if (data) {
            // Clonamos dataValues para no modificar el objeto original
            const result = data.get()
            // Eliminamos los campos que no queremos en el resultado
            //delete result.password
            delete result.token_temp
            delete result.createdAt
            delete result.updatedAt
            // Agrega aquí cualquier otro campo que desees eliminar
            return result
        }
        return null // o manejar como prefieras si el usuario no se encuentra
    } catch (error) {
        throw error
    }
}
const getProfileUser = async (id) => {
    try {
        const data = await db.User.findOne({
            where: { id, status: 1 },
            include: [
                {
                    association: 'PersonData',
                    include: [
                        { association: 'Person_legal' },
                        { association: 'Person_physical' },
                        {
                            association: 'Person_Address',
                            where: { status: 1 },
                            attributes: ['id'],
                            include: [
                                {
                                    association: 'Address',
                                    include: [
                                        {
                                            association: 'city',
                                        },
                                        {
                                            association: 'street',
                                        },
                                        {
                                            association: 'state',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        })
        if (data) {
            // Clonamos dataValues para no modificar el objeto original
            const result = data.get()
            // Eliminamos los campos que no queremos en el resultado
            //delete result.password
            delete result.token_temp
            delete result.createdAt
            delete result.updatedAt
            // Agrega aquí cualquier otro campo que desees eliminar
            return result
        }
        return null // o manejar como prefieras si el usuario no se encuentra
    } catch (error) {
        throw error
    }
}

const getUsersRegistered = async (id) => {
    try {
        const query = {
            include: [
                {
                    model: db.User_People,
                    as: 'User_People',
                    attributes: ['level'],
                },
            ],
        }
        if (id) {
            query.where = { id }
        }
        return await db.User.findAll(query)
    } catch (error) {
        throw error
    }
}

const createPersonProcoop = async (dataUpdate, user, dataProcoop, t) => {
    try {
        // SE GENERA UN OBJETO DONDE TENGA TODO LOS VALORES DE PROCOOP, PARA QUE EN CASO DE QUE NO EXISTA CREARLO
        const dataProcoopMember = {
            procoop_last_name: dataProcoop.APELLIDOS,
            email: dataProcoop.EMAIL,
            number_customer: dataUpdate.number_customer,
            type_person: dataProcoop.TIP_PERSO,
            situation_tax: dataProcoop.COD_SIT,
            cell_phone: `${dataUpdate.phoneCaract} ${dataUpdate.numberPhone}`,
            type_document: dataProcoop.TIP_DNI,
            number_document: dataProcoop.NUM_DNI,
        }

        // SE BUSCA O CREA LA PERSONA CON LOS DATOS DE PROCOOP
        const [PersonProcoop, createdPersonProcoop] =
            await db.Person.findOrCreate({
                where: { number_document: dataProcoop.NUM_DNI },
                defaults: { ...dataProcoopMember },
                transaction: t,
            })
        // SI SE CREO, DEBEMOS CREAR LA PERSONA FISICA O LEGAL DE LA PERSONA CREADA DE PROCOOP.
        if (createdPersonProcoop) {
            // DEPENDIENDO DEL TIPO DE PERSONA SE GENERA UN OBJETO CON SUS DATOS Y SE GUARDA EL REGISTRO DE ESA PERSONA.
            // 1 ES PERSONA FISICA, 2 PERSONA LEGAL
            if (dataProcoop.TIP_PERSO === 1) {
                const dataPersonPhysicalProcoop = {
                    name: dataUpdate.name_customer,
                    last_name: dataUpdate.last_name_customer,
                    type_dni: dataProcoop.TIP_DNI,
                    num_dni: dataProcoop.NUM_DNI,
                    born_date: dataProcoop.FEC_NAC
                        ? new Date(`${dataProcoop.FEC_NAC} `)
                        : null,
                    blood_type: dataProcoop.GRU_SGR,
                    factor: dataProcoop.FAC_SGR,
                    donor: dataProcoop.DAD_SGR,
                    id_type_sex: dataProcoop.SEXO === 'M' ? 2 : 1,
                    id_person: PersonProcoop.id,
                }
                // SE CREA LA PERSONA FISICA DE PERSONA DE PROCOOP
                await db.Person_physical.create(dataPersonPhysicalProcoop, {
                    transaction: t,
                })
            } else {
                const dataPersonLegalProcoop = {
                    social_raeson: dataUpdate.name_customer,
                    fantasy_name: dataUpdate.last_name_customer,
                    cuit: dataProcoop.NUM_DNI,
                    date_registration: new Date(`${dataProcoop.FEC_NAC} `),
                    id_person: PersonProcoop.id,
                }
                // SE CREA LA PERSONA LEGAL DE PERSONA DE PROCOOP
                await db.Person_legal.create(dataPersonLegalProcoop, {
                    transaction: t,
                })
            }
        }
        // SE CREA UN OBJETO PARA LA RELACION DE PERSON Y USER EN LA TABLA DE USER_PEOPLE
        const relationPersonProcoop = {
            id_person: PersonProcoop.id,
            id_user: user.id,
            level: dataUpdate.level,
            primary_account: true,
            status: true,
        }
        // SE BUSCA Y CREA UN REGISTRO DE USER_PEOPLE SEGUN EL ID DEL USUARIO
        const [relationProcoop, create] = await db.User_People.findOrCreate({
            where: { id_user: user.id, id_person: PersonProcoop.id },
            defaults: { ...relationPersonProcoop },
            transaction: t,
        })
        // EN CASO DE QUE SE ENCUENTRE UN REGISTRO CON ESOS VALORES SE ACTUALIZA EL REGISTRO
        if (!create)
            await relationProcoop.update(relationPersonProcoop, {
                transaction: t,
            })
        return PersonProcoop
    } catch (error) {
        throw error
    }
}
const updatePersonUserCreated = async (
    dataUpdate,
    user,
    dataPerson,
    dataProcoop,
    t
) => {
    try {
        // const procoopmember = dataUpdate.document_number == dataProcoop.NUM_DNI
        const dataInfo = {
            procoop_last_name:
                dataProcoop.NUM_DNI !== dataUpdate.number_document
                    ? ''
                    : dataProcoop.APELLIDOS,
            fixed_phone:
                dataProcoop.NUM_DNI !== dataUpdate.number_document
                    ? dataProcoop.TELEFONO
                    : dataUpdate.fixed_phone || null,
            situation_tax:
                dataProcoop.NUM_DNI !== dataUpdate.number_document
                    ? dataProcoop.COD_SIT
                    : dataUpdate.situation_tax || null,
        }
        // SE GENERA UIN OBJETO CON LOS DATOS DEL PERFIL DEL USUARIO PARA ACTUALIZAR LA PERSONA QUE SE CREO ANTES YA QUE NO EXISTIA CON ESE DNI
        const dataPersonUser = {
            procoop_last_name: dataInfo.procoop_last_name,
            email: user.email,
            number_customer: dataPerson.number_customer,
            type_person: user.type_person,
            cell_phone: `${dataUpdate.phoneCaract} ${dataUpdate.numberPhone}`,
            fixed_phone: dataInfo.fixed_phone,
            situation_tax: dataInfo.situation_tax,
            type_document: dataUpdate.document_type,
            number_document: dataUpdate.document_number,
        }
        // SE ACTUALIZA EL REGISTRO
        const PersonUser = await dataPerson.update(dataPersonUser, {
            transaction: t,
        })
        // SEGUN EL TIPO DE PERSONA DEL USUARIO SE CREA LA PERSONA FISICA (1) O LEGAL(2)
        if (PersonUser.type_person === 1) {
            const dataPersonPhysicalProfile = {
                name: user.name_register,
                last_name: user.last_name_register,
                type_dni: dataUpdate.document_type,
                num_dni: dataUpdate.document_number,
                born_date: new Date(`${dataUpdate.birthdate} `),
                id_type_sex: dataUpdate.sex,
                id_person: PersonUser.id,
            }
            const [Physical, created] = await db.Person_physical.findOrCreate({
                where: { num_dni: dataPersonPhysicalProfile.num_dni },
                defaults: { ...dataPersonPhysicalProfile },
                transaction: t,
            })
            // if (!created)
            //     await Physical.update(dataPersonPhysicalProfile, {
            //         transaction: t,
            //     })
        } else {
            const dataPersonLegalProfile = {
                social_raeson: user.name_register,
                fantasy_name: user.last_name_register,
                cuit: dataUpdate.document_number,
                date_registration: new Date(`${dataUpdate.birthdate} `),
                id_person: PersonUser.id,
            }
            const [Physical, created] = await db.Person_legal.findOrCreate({
                where: { cuit: dataPersonLegalProfile.cuit },
                defaults: { ...dataPersonLegalProfile },
                transaction: t,
            })
            // if (!created)
            //     await Physical.update(dataPersonLegalProfile, {
            //         transaction: t,
            //     })
        }
        // SE BUSCA EL USUARIO PARA ACTUALIZAR EL VALOR DEL ID_PERSON, PARA RELACIONAR UNA PERSONA CON EL USUARIO PARA QUE LOS DATOS DE ESA PERSONA SEAN LOS DATOS DE PERFIL
        const userData = await db.User.findOne({
            where: { id: user.id },
            transaction: t,
        })
        // SI NO EXISTE SE DEVUELVE UN ERROR
        if (!userData) throw new Error('No se encontro usuario con ese id')

        await userData.update(
            { id_person_profile: PersonUser.id, lvl2_date: new Date() },
            { transaction: t }
        )
        return PersonUser
    } catch (error) {
        throw error
    }
}
const createAddressUser = async (dataUpdate, PersonData, t) => {
    console.log('llega', dataUpdate)
    try {
        const city = await db.City.findOne(
            { where: { id: dataUpdate.id_city } },
            { transaction: t }
        )
        console.log('city', city)
        const state = await db.State.findOne(
            { where: { cod_pro: dataUpdate.id_state } },
            { transaction: t }
        )
        const address = {
            number_address: dataUpdate.number_address,
            floor: dataUpdate.floor || null,
            dpto: dataUpdate.dpto || null,
            postal_code: dataUpdate.postal_code || null,
            google_address: dataUpdate.google_address || null,
            id_street: dataUpdate.id_street,
            id_city: city.id,
            id_state: state.id,
        }
        const [AddressUser, createdAddressUser] = await db.Address.findOrCreate(
            {
                where: {
                    number_address: address.number_address,
                    id_city: address.id_city,
                    id_state: address.id_state,
                    id_street: address.id_street,
                },
                defaults: { ...address },
                transaction: t,
            }
        )

        const dataUserAddress = {
            status: true,
            id_person: PersonData.id,
            id_address: AddressUser.id,
        }
        await db.Person_Address.findOrCreate({
            where: { id_person: PersonData.id, id_address: AddressUser.id },
            defaults: { ...dataUserAddress },
            transaction: t,
        })
    } catch (error) {
        throw error
    }
}

const createPerson = async (data, t) => {
    // La transaccion `t` es propiedad de quien llama (levelUp): el rollback lo
    // hace el caller. Aca solo se propaga el error.
    const person = await db.Person.create(data, { transaction: t })
    return person
}

const updatePersonByNumberDocument = async (data) => {
    const t = await db.sequelize.transaction()
    try {
        const person = await db.Person.findOne({
            where: { number_document: data.number_document },
        })
        if (!person) throw new Error('La persona no existe')
        await person.update(data, { transaction: t })
        await t.commit()
        return person
    } catch (error) {
        await t.rollback()
        throw error
    }
}

const createPhysicalIfNotExists = async (
    data,
    person,
    user,
    customerProcoop,
    t
) => {
    // La transaccion `t` es propiedad de quien llama (levelUp): el rollback lo
    // hace el caller. Aca solo se propaga el error.
    const physical = await db.Person_physical.create(
        {
            name: user.name_register,
            last_name: user.last_name_register,
            type_dni: data.document_type,
            num_dni: data.document_number,
            born_date: formatDate(data.birthdate),
            id_type_sex: data.sex,
            id_person: person.id,
        },
        { transaction: t }
    )

    // Creo la direccion y la realaciono a Person Adress
    const address = await db.Address.create(
        {
            number_address: data.number_address,
            id_street: data.id_street,
            id_city: data.id_city,
            id_state: data.id_state,
        },
        { transaction: t }
    )

    await db.Person_Address.create(
        {
            status: true,
            id_person: person.id,
            id_address: address.id,
        },
        { transaction: t }
    )

    // Creo la relacion de User_People
    const userPeople = await db.User_People.create(
        {
            procoop_number: data.number_customer,
            procoop_last_name: customerProcoop[0].APELLIDOS,
            id_user: user.id,
            level: data.level,
            primary_account: true,
            status: 1,
        },
        { transaction: t }
    )

    return {
        person,
        physical,
        userPeople,
    }
}

const createLegalIfNotExists = async (data, person, user, customerProcoop, t) => {
    // La transaccion `t` es propiedad de quien llama (levelUp): el rollback lo
    // hace el caller. Aca solo se propaga el error.
    const legal = await db.Person_legal.create(
        {
            social_raeson: user.name_register,
            fantasy_name: user.last_name_register,
            cuit: data.document_number,
            date_registration: formatDate(data.birthdate),
            id_person: person.id,
        },
        { transaction: t }
    )

    // Creo la direccion y la realaciono a Person Adress
    const address = await db.Address.create(
        {
            number_address: data.number_address,
            id_street: data.id_street,
            id_city: data.id_city,
            id_state: data.id_state,
        },
        { transaction: t }
    )

    await db.Person_Address.create(
        {
            status: true,
            id_person: person.id,
            id_address: address.id,
        },
        { transaction: t }
    )

    // Creo la relacion de User_People
    const userPeople = await db.User_People.create(
        {
            procoop_number: data.number_customer,
            procoop_last_name: customerProcoop[0].APELLIDOS,
            id_user: user.id,
            level: data.level,
            primary_account: true,
            status: 1,
        },
        { transaction: t }
    )

    return {
        person,
        legal,
        userPeople,
    }
}

const existAccountInUser = async (num_soc, user_id) => {
    const user = await db.User_People.findOne({
        where: { procoop_number: num_soc, id_user: user_id },
    })
    return user
}

const addOtherCustomerService = async (customer, user, current = false) => {
    const t = await db.sequelize.transaction()
    try {
        const customerProcoop = await findCustomerByCodSoc(
            customer.num_customer
        )

        if (!customerProcoop) throw new Error('El socio no existe')
        if (await existAccountInUser(customer.num_customer, user.id))
            throw new Error('El socio ya esta relacionado con el usuario')
        const otherCustomer = await db.User_People.create(
            {
                procoop_number: customer.num_customer,
                procoop_last_name: customerProcoop[0].APELLIDOS,
                id_user: user.id,
                level: customer.level,
                primary_account: current ? true : false,
                status: 1,
            },
            { transaction: t }
        )

        if (current) {
            const userPeople = await db.User_People.findOne({
                where: { id_user: user.id, primary_account: true },
            })
            if (!userPeople)
                throw new Error('Este usuario no tiene una cuenta principal')
            userPeople.primary_account = false
            await userPeople.save({ transaction: t })
        }

        await t.commit()
        return otherCustomer
    } catch (error) {
        await t.rollback()
        throw error
    }
}

const levelUp = async (data) => {
    const t = await db.sequelize.transaction()
    try {
        const user = await db.User.findOne({
            where: { id: data.id },
        })
        if (!user) throw new Error('El usuario no existe')
        const customerProcoop = await findCustomerByCodSoc(data.number_customer)
        if (!customerProcoop) throw new Error('El socio no existe')
        // Evito crear una relacion duplicada si el socio ya esta vinculado al usuario
        if (await existAccountInUser(data.number_customer, user.id))
            throw new Error('El socio ya esta relacionado con el usuario')
        const person = await db.Person.findOne({
            where: { number_document: data.document_number },
        })
        // Si no existe la persona, se crea
        let people
        if (!person) {
            people = await createPerson(
                {
                    email: user.email,
                    type_person: user.type_person,
                    cell_phone: `${data.phoneCaract} ${data.numberPhone}`,
                    type_document: data.document_type,
                    number_document: data.document_number,
                },
                t
            )

            await user.update(
                { id_person_profile: people.id },
                { transaction: t }
            )

            if (user.type_person === 1) {
                const { person, physical, userPeople } =
                    await createPhysicalIfNotExists(
                        data,
                        people,
                        user,
                        customerProcoop,
                        t
                    )
                await t.commit()
                return { person, physical, userPeople, user }
            } else {
                // Persona juridica
                const { person, legal, userPeople } =
                    await createLegalIfNotExists(
                        data,
                        people,
                        user,
                        customerProcoop,
                        t
                    )
                await t.commit()
                return { person, legal, userPeople, user }
            }
        } else {
            //Agrego el id de la persona al usuario
            await user.update(
                { id_person_profile: person.id },
                { transaction: t }
            )
            // Si la persona existe, solo creo la relacion con userPeople
            const userPeople = await db.User_People.create(
                {
                    procoop_number: data.number_customer,
                    procoop_last_name: customerProcoop[0].APELLIDOS,
                    id_user: user.id,
                    level: data.level,
                    primary_account: true,
                    status: 1,
                },
                { transaction: t }
            )
            await t.commit()
            return { person, userPeople, user }
        }
    } catch (error) {
        await t.rollback()
        throw error
    }
}

const updateLvl2 = async (user, dataUpdate) => {
    return db.sequelize.transaction(async (t) => {
        try {
            // SE BUSCA EL SOCIO QUE SELECCIONO EL USUARIO PARA SUBIR DE NIVEL, SE OBTIENE EL DNI Y SE CONTROLA QUE NO EXISTA.
            const datoUser = await Persona_x_COD_SOC(dataUpdate.number_customer)
            let dataProcoop
            if (datoUser.length) {
                dataProcoop = datoUser[0]
            } else {
                dataProcoop = datoUser
            }
            if (!dataProcoop)
                throw new Error('El numero de socio no es correcto')
            const dataPersonUser = {
                procoop_last_name: '',
                email: user.email,
                number_customer:
                    dataUpdate.number_customer || dataProcoop.NUM_SOC,
                type_person: user.type_person,
                cell_phone: `${dataUpdate.phoneCaract} ${dataUpdate.numberPhone}`,
                type_document: parseInt(dataUpdate.document_type),
                number_document: dataUpdate.document_number,
            }
            // }
            // SE BUSCA O CREA EL REGISTO CON EL DNI DEL PERFIL DEL USUARIO

            const [dataPerson, createdPerson] = await db.Person.findOrCreate({
                where: { number_document: dataUpdate.document_number },
                defaults: { ...dataPersonUser },
                transaction: t,
            })
            // EN CASO DE QUE SE CREO UN NUEVO REGISTRO
            if (createdPerson) {
                // SE VALIDA QUE LOS DNI DE PROCOOP Y EL QUE INGRESO EL USUARIO NO SEAN IGUALES
                // EN CASO DE QUE SEAN DIFERENTE SE DEBEN GENERAR 2 REGISTROS 1 PARA LA PERSONA DE PROCOOP Y  PARA EL PERFIL DEL USUARIO
                if (dataProcoop.NUM_DNI !== dataUpdate.number_document) {
                    // FUNCION QUE CREA LA PERSONA, PERSONA FISICA/LEGAL DE PROCOOP
                    const personProcoop = await createPersonProcoop(
                        dataUpdate,
                        user,
                        dataProcoop,
                        t
                    )
                    const PersonUser = await updatePersonUserCreated(
                        dataUpdate,
                        user,
                        dataPerson,
                        dataProcoop,
                        t
                    )
                    await createAddressUser(dataUpdate, PersonUser, t)
                } else {
                    // EN CASO DE QUE LOS DNI SEAN IGUALES DEBO CREAR UN SOLO REGISTRO DE PERSONA CON LOS DATOS CARGADOS POR EL USUARIO
                    const PersonUser = await updatePersonUserCreated(
                        dataUpdate,
                        user,
                        dataPerson,
                        dataProcoop,
                        t
                    )
                    // SE DEBE CREAR LA RELACION ENTRE EL USUARIO Y PERSONA CARGANDO ESTE OBJETO EN LA TABLA DE USER_PERSON
                    const relationPerson = {
                        id_person: PersonUser.id,
                        id_user: user.id,
                        level: dataUpdate.level,
                        primary_account: true,
                        status: true,
                    }
                    const [relationProcoop, createRelation] =
                        await db.User_People.findOrCreate({
                            where: {
                                id_user: user.id,
                                id_person: PersonUser.id,
                            },
                            defaults: { ...relationPerson },
                            transaction: t,
                        })
                    // EN CASO DE QUE SE ENCUENTRE UN REGISTRO CON ESOS VALORES SE ACTUALIZA EL REGISTRO
                    if (!createRelation)
                        await relationProcoop.update(relationPerson, {
                            transaction: t,
                        })
                    await createAddressUser(dataUpdate, PersonUser, t)
                }
            } else {
                const PersonUser = await updatePersonUserCreated(
                    dataUpdate,
                    user,
                    dataPerson,
                    dataProcoop,
                    t
                )
                // SE DEBE CREAR LA RELACION ENTRE EL USUARIO Y PERSONA CARGANDO ESTE OBJETO EN LA TABLA DE USER_PERSON
                console.log(dataProcoop)
                const relationPerson = {
                    id_person: dataProcoop.id,
                    id_user: user.id,
                    level: dataUpdate.level,
                    primary_account: true,
                    status: true,
                }
                const [relationProcoop, createRelation] =
                    await db.User_People.findOrCreate({
                        where: { id_user: user.id, id_person: PersonUser.id },
                        defaults: { ...relationPerson },
                        transaction: t,
                    })
                // EN CASO DE QUE SE ENCUENTRE UN REGISTRO CON ESOS VALORES SE ACTUALIZA EL REGISTRO
                if (!createRelation)
                    await relationProcoop.update(relationPerson, {
                        transaction: t,
                    })
                await createAddressUser(dataUpdate, PersonUser, t)
            }
            return dataPerson
        } catch (error) {
            throw error
        }
    })
}

const getLevel = async (id) => {
    try {
        const data = await db.User_People.findAll({ where: { id_user: id } })
        return data
    } catch (error) {
        throw error
    }
}
const saveUser = async (userData) => {
    try {
        const { id, ...data } = userData
        let user
        if (id) {
            user = await db.User.findOne({ where: { id } })
            if (!user) throw new Error('El usuario no existe')
            await user.update(data)
        } else {
            user = await db.User.create(data)
        }
        return user
    } catch (error) {
        throw error
    }
}
const getUserxDni = async (dni) => {
    try {
        let user = await db.Person_physical.findOne({
            where: { num_dni: dni },
            include: [
                {
                    association: 'typeSex',
                },
                {
                    association: 'dataPerson',
                    include: [
                        {
                            association: 'Person_Address',
                            include: [
                                {
                                    association: 'Address',
                                    include: [
                                        {
                                            association: 'city',
                                        },
                                        {
                                            association: 'street',
                                        },
                                        {
                                            association: 'state',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        })
        if (!user) {
            user = await db.Person_legal.findOne({
                where: { cuit: dni },
                include: [
                    {
                        association: 'dataPerson',
                        include: [
                            {
                                association: 'Person_Address',
                                include: [
                                    {
                                        association: 'Address',
                                        include: [
                                            {
                                                association: 'city',
                                            },
                                            {
                                                association: 'street',
                                            },
                                            {
                                                association: 'state',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            })
        }
        if (!user) return null
        return user.get()
    } catch (error) {
        throw error
    }
}
const getUserxNumCustomer = async (num) => {
    try {
        let responseData
        let user = await findCustomerByCodSoc(num)
        if (user[0].tip_perso === 1) {
            responseData = { name: '', last_name: user[0].APELLIDOS }
        } else {
            responseData = {
                social_raeson: user[0].APELLIDOS,
                fantasy_name: user[0].NOMBRES,
            }
        }
        if (!user) throw new Error('El numero de socio no existe')
        return responseData
    } catch (error) {
        throw error
    }
}

const deleteUserPerson = async (id) => {
    return db.sequelize.transaction(async (t) => {
        try {
            const UserPerson = await db.User_People.findOne({ where: { id } })
            if (!UserPerson) throw new Error('La relación no existe')
            await UserPerson.destroy({ transaction: t })
            return { message: 'Se elimino correctamente' }
        } catch (error) {
            throw error
        }
    })
}
const updatePrimaryAccountUserProcoop = async (id_relation, id) => {
    return db.sequelize.transaction(async (t) => {
        try {
            const listUserPerson = await db.User_People.findAll({
                where: { id_user: id },
            })
            if (!listUserPerson) throw new Error('No se encontraron relaciones')
            await db.User_People.update(
                { primary_account: 0 },
                { where: { id_user: id }, transaction: t }
            )
            const specificRelation = listUserPerson.find(
                (relation) => relation.dataValues.id == id_relation
            )
            if (!specificRelation) {
                throw new Error('No se encontró la relación especificada')
            }
            specificRelation.primary_account = 1
            await specificRelation.save({ transaction: t })
            return { message: 'Se cambió la cuenta principal correctamente' }
        } catch (error) {
            throw error
        }
    })
}

module.exports = {
    getUserxNumCustomer,
    getUserxEmail,
    setTokenTemporal,
    RegisterAcept,
    verifyEmailToken,
    getUser,
    getLevel,
    updateLvl2,
    saveUser,
    getUserxDni,
    deleteUserPerson,
    updatePrimaryAccountUserProcoop,
    createPersonProcoop,
    getUsersRegistered,
    getProfileUser,
    getUserxId,
    levelUp,
    addOtherCustomerService,
}
