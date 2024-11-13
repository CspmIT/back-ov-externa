const { db } = require('../models/index.js')
const {
    connexionProcoop,
    userOncativoGet,
    getAllProcoop,
} = require('../services/ProcoopService.js')
const {
    ListCityProcoop,
    ListStateProcoop,
    empresaPorCuit,
    personaPorDni,
    Persona_x_COD_SOC,
    getOrCreateProcoopMember,
    ListStreetProcoop,
    getPriceAndDescTelefonia,
    getPriceAndDescTV,
    getPriceAndDescInternet,
    getSituations,
    getRelationshipsProcoop,
} = require('../services/ProcoopService.js')
const {
    updatePrimaryAccountUserProcoop,
    deleteUserPerson,
} = require('../services/UserService.js')

async function testConectOncativo(req, res) {
    try {
        const result = await connexionProcoop()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({ error, msj: error.messagge })
    }
}

async function oncativoUser(req, res) {
    try {
        const result = await userOncativoGet()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({ error, msj: error.messagge })
    }
}

async function searchByDNI(req, res) {
    const { dni } = req.body
    try {
        const result = await personaPorDni(dni)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({ error, msj: error.messagge })
    }
}

async function searchByCuit(req, res) {
    const { cuit } = req.body
    try {
        const result = await empresaPorCuit(cuit)
        return res.status(200).json(result)
    } catch (error) {
        return res.json({ error, msj: 'error' })
    }
}

async function getAllStreet(req, res) {
    try {
        const listCities = await ListStreetProcoop()
        return res.status(200).json(listCities)
    } catch (error) {
        return res.json({ error, msj: 'error' })
    }
}
async function migrationCity(req, res) {
    try {
        const listCities = await ListCityProcoop()
        let citiesOfi = []
        if (listCities) {
            citiesOfi = await listCities.map((item) => {
                return {
                    cod_loc: item.COD_LOC,
                    des_loc: item.DES_LOC,
                    cod_pos: item.COD_POS,
                    cod_pci: item.COD_PCI,
                }
            })
        }
        const resultadd = await db.City.bulkCreate(citiesOfi)
        return res.status(200).json(resultadd)
    } catch (error) {
        return res.json({ error, msj: 'error' })
    }
}
async function migrationState(req, res) {
    try {
        const ListStates = await ListStateProcoop()
        let listStateOfi = []

        if (ListStates) {
            listStateOfi = await ListStates.map((item) => {
                return {
                    cod_pro: item.COD_PRO,
                    des_pro: item.DES_PRO,
                    cod_afip: item.COD_AFIP,
                }
            })
        }
        const resultado = await db.State.bulkCreate(listStateOfi)
        return res.status(200).json(resultado)
    } catch (error) {
        console.log(error)
        return res.json({ error, msj: error })
    }
}
async function getNameCustomer(req, res) {
    try {
        const { customer } = req.body
        const result = await Persona_x_COD_SOC(customer)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
    // Persona_x_COD_SOC
}
async function addUserPersonMember(req, res) {
    try {
        const Person = await getOrCreateProcoopMember(req.body, req.user)
        return res.status(200).json(Person)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}
async function removeUserPersonMember(req, res) {
    try {
        const { id_relation } = req.query
        const relationUserPerson = await deleteUserPerson(id_relation)
        return res.status(200).json(relationUserPerson)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}
async function changePrimaryAccountUserProcoop(req, res) {
    try {
        const { id_relation } = req.query
        const { id } = req.user
        const relationUserProcoopMember = await updatePrimaryAccountUserProcoop(
            id_relation,
            id
        )
        return res.status(200).json(relationUserProcoopMember)
    } catch (error) {
        return res.status(404).json(error.message)
    }
}

async function getServicesTelecomunications(req, res) {
    try {
        console.log(req.params)

        const { typeUser } = req.params
        if (typeUser === '1') {
            const tv = await getPriceAndDescTV()
            const internet = await getPriceAndDescInternet()
            const telefonia = await getPriceAndDescTelefonia(1)
            return res.status(200).json({ tv, internet, telefonia })
        } else if (typeUser === '2' || typeUser === '5') {
            const tv = await getPriceAndDescTV()
            const internet = await getPriceAndDescInternet()
            const telefonia = await getPriceAndDescTelefonia(2)
            return res.status(200).json({ tv, internet, telefonia })
        } else if (typeUser === '3') {
            const tv = await getPriceAndDescTV(3)
            const internet = await getPriceAndDescInternet(3)
            return res.status(200).json({ tv, internet })
        } else if (typeUser === '4') {
            const tv = await getPriceAndDescTV()
            const internet = await getPriceAndDescInternet(4)
            const telefonia = await getPriceAndDescTelefonia(4)
            return res.status(200).json({ tv, internet, telefonia })
        } else {
            return res
                .status(400)
                .json({ message: 'El tipo de usuario no es valido' })
        }
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

// Obtener las situaciones de iva de procoop
async function getSituationsIva(req, res) {
    try {
        const situations = await getSituations()
        return res.status(200).json(situations)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

async function getRelationships(req, res) {
    try {
        const { id } = req?.params
        const relationships = await getRelationshipsProcoop(id || null)
        console.log(relationships)
        return res.status(200).json(relationships)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

async function getAll(req, res) {
    try {
        const result = await getAllProcoop()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

module.exports = {
    searchByCuit,
    searchByDNI,
    getAllStreet,
    migrationCity,
    migrationState,
    getNameCustomer,
    addUserPersonMember,
    removeUserPersonMember,
    changePrimaryAccountUserProcoop,
    getServicesTelecomunications,
    getSituationsIva,
    testConectOncativo,
    oncativoUser,
    getRelationships,
    getAll,
}
