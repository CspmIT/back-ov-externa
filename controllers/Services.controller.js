const {
    serviceCustomer,
    consumoCustomer,
    Persona_x_COD_SOC,
    adheridosSS,
} = require('../services/ProcoopService.js')
const dbCodes = require('../utils/Procoop/databaseCodes.json')
const codes = require('../utils/Procoop/serviceCode.json')

async function getServicesCustomer(req, res) {
    try {
        const { id_procoop, medition } = req.query
        console.log(medition)
        if (!id_procoop) {
            throw new Error('Usuario no encontrado')
        }
        const dataSoc = { type: 'COD_SOC', number: id_procoop }
        //Busca por codigo de socio los servicios del usuario
        const services = await serviceCustomer(dataSoc)
        const groupedServices = services.reduce((acc, service) => {
            const code = dbCodes.find(
                (code) => code.COD_SER === service.COD_SER
            )
            if (code) {
                const key = `${service.COD_SER}`
                if (!acc[key]) {
                    acc[key] = {
                        icon: code?.ICON,
                        color: code?.COLOR,
                        COD_SER: service.COD_SER,
                        DES_SER: code.DESCRIPCION_OFICINA,
                        services: [],
                    }
                }
                acc[key].services.push({
                    cod_ser: service.COD_SER,
                    color: code.COLOR,
                    icon: code.ICON,
                    graphic: code.SERVICIO_MEDIDO,
                    category: code.DESCRIPCION_CATEGORIA,
                    address: `${service.CALLECUENTA} ${parseInt(
                        service.ALTURACALLECUENTA
                    )}`,
                    account: service.COD_SUM,
                    detail:
                        service['NUM_MED/NUMTEL'] !== ''
                            ? (code.COD_SER === 9 ? 'TEL ' : 'MEDIDOR Nº ') +
                              service['NUM_MED/NUMTEL']
                            : '',
                    status: !service.BAJA_ADM ? 1 : 0,
                    unidad: code.UNIDAD_MEDIDA,
                })
            }
            return acc
        }, {})

        let filteredServices = Object.values(groupedServices)
        // Si llega true en medicion solo se devuelven los servicios que son medidos
        if (medition) {
            filteredServices = filteredServices
                .map((serviceGroup) => ({
                    ...serviceGroup,
                    services: serviceGroup.services.filter(
                        (service) => service.graphic
                    ),
                }))
                .filter((serviceGroup) => serviceGroup.services.length > 0)
        }
        res.status(200).json(filteredServices)
    } catch (error) {
        console.log(error)
        res.status(400).json(error.message)
    }
}

async function getDataServiceGral(req) {
    const dataSoc = { type: 'cod_sum', number: req.cod_sum }
    const services = await serviceCustomer(dataSoc)
    const customer = await Persona_x_COD_SOC(services[0].COD_SOC)
    const serviceCodes = codes.SV
    let dataService = []
    const typeServicerequest = serviceCodes[req.service] || null
    for (let i in services) {
        let typeService = serviceCodes[services[i].COD_SER] || null
        if (!typeService) {
            continue
        }
        if (
            services[i].cod_ser == req.service ||
            typeService == typeServicerequest
        ) {
            dataService.push({
                account: services[i].COD_SUM,
                service: typeService,
                address: `${services[i].CALLECUENTA} ${parseInt(
                    services[i].ALTURACALLECUENTA
                )}`,
                nameCustomer: customer[0]?.APELLIDOS
                    ? customer[0].APELLIDOS
                    : customer.procoop_last_name,
                titleService: services[i].DES_SER,
                category: services[i].NOMBRE_CATEGORIA,
                detail: services[i]['NUM_MED/NUMTEL']
                    ? (typeService === 'TELEFONO' ? 'TEL ' : 'MEDIDOR Nº ') +
                      services[i]['NUM_MED/NUMTEL']
                    : '',
                status: !services[i].ALTA_ADM
                    ? 2
                    : !services[i].BAJA_ADM
                    ? 1
                    : 0,
            })
        }
    }
    return dataService
}
async function getDetailConsumption(req, res) {
    try {
        const { service, account } = req.query
        if (!service || !account) {
            throw new Error('Se debe ingresar el servicio y la cuenta')
        }

        const consumptions = await consumoCustomer(service, account)

        return res.status(200).json(consumptions)
    } catch (error) {
        return res.status(400).json({ error: error.messagge })
    }
}

async function getAllConsumptionsGroupedByAccount(req, res) {
    try {
        const { id_procoop } = req.query
        if (!id_procoop) {
            throw new Error('Usuario no encontrado')
        }

        const dataSoc = { type: 'COD_SOC', number: id_procoop }
        const services = await serviceCustomer(dataSoc)

        const filteredServices = services.filter((service) => {
            const code = dbCodes.find(
                (code) =>
                    code.COD_SER === service.COD_SER &&
                    code.SERVICIO_MEDIDO &&
                    service.BAJA_ADM === null
            )
            if (code) {
                return service
            }
        })

        const groupedServices = {}

        for (const service of filteredServices) {
            const consumptions = await consumoCustomer(
                service.COD_SER,
                service.COD_SUM
            )
            if (!groupedServices[service.COD_SER]) {
                groupedServices[service.COD_SER] = {
                    name: service.DES_SER,
                    accounts: {},
                }
            }
            groupedServices[service.COD_SER].accounts[service.COD_SUM] = {
                address: `${service.CALLECUENTA} ${parseInt(
                    service.ALTURACALLECUENTA
                )}`,
                consumos: consumptions,
                detail: service['NUM_MED/NUMTEL'],
                unidad: dbCodes.find((code) => code.COD_SER === service.COD_SER)
                    .UNIDAD_MEDIDA,
            }
        }

        console.log(groupedServices)

        res.status(200).json(groupedServices)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

async function DetailServiceGraf(req) {
    const dataServ = await getDataServiceGral(req)
    const dataSearch = { ser: req.service, account: req.cod_sum }
    const consumpts = await consumoCustomer(dataSearch)
    let dataGraf = { data: [], label: [] }
    for (let j in consumpts) {
        dataGraf.data.push(parseFloat(consumpts[j].consumo))
        dataGraf.label.push(consumpts[j].periodo)
    }
    const difConsumo =
        parseFloat(consumpts[0].consumo) -
        parseFloat(consumpts[consumpts.length - 1].consumo)
    const DataServiceElectric = {
        generalData: dataServ,
        difCosumo: difConsumo,
        graficData: dataGraf,
    }
    return DataServiceElectric
}

async function getDataServiceSocial(req) {
    const dataServ = await getDataServiceGral(req)
    const serviceCodes = codes.SV
    const service = serviceCodes[req.service] == 'SEPELIO' ? [4, 90] : [3, 89]
    const dataSearch = { ser: service, account: req.cod_sum }
    const IncreasedService = await adheridosSS(dataSearch)
    let dataAdherido = []
    for (let data of IncreasedService) {
        dataAdherido.push({
            name: data.apellidos || '',
            category: data.des_vin || '',
            dni: data.num_dni || '',
            groupBlood: data.gru_sgr || '',
            burn: data.fec_nac || '',
        })
    }
    const datosSS = {
        generalData: dataServ,
        adheridos: dataAdherido,
    }
    return datosSS
}

module.exports = {
    // customerConsumption,
    getServicesCustomer,
    getDetailConsumption,
    getAllConsumptionsGroupedByAccount,
}
