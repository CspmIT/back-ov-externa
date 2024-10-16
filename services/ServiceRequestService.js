const { db } = require('../models');

const createRequestService = async (userID, services) => {
    const t = await db.sequelize.transaction();
    try {
        const serviceRequest = {
            id_user: userID,
            status: 1,
            person_data: {},
        };

        const requestService = await db.Service_Request.create(serviceRequest, {
            transaction: t,
        });

        const id_form = [];
        for (const element of services) {
            if (element.tipo !== 0) {
                const service_form = await db.Service_Form.create(
                    {},
                    { transaction: t }
                );
                id_form.push(service_form.id);
            }
        }

        const servicesToSave = services
            .filter((service) => service.tipo !== 0)
            .map((service, index) => ({
                id_service_request: requestService.id,
                id_service_form: id_form[index],
                service_type: service.tipo,
                status: 1,
                service_name: service.nombre,
            }));

        await db.Service_Items.bulkCreate(servicesToSave, { transaction: t });

        await t.commit();

        return requestService;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const returnLaterService = async (
    serviceRequest,
    ServiceItems = undefined,
    ServiceForm = undefined
) => {
    const t = await db.sequelize.transaction();
    try {
        const updateRquest = await db.Service_Request.update(serviceRequest, {
            where: { id: serviceRequest.id },
            transaction: t,
        });

        if (ServiceItems !== undefined) {
            for (const item of ServiceItems) {
                await db.Service_Items.update(
                    { status: 0 },
                    { where: { id: item.id }, transaction: t }
                );
            }
        }

        if (ServiceForm !== undefined) {
            for (const form of ServiceForm) {
                await db.Service_Form.update(
                    { status: 0 },
                    { where: { id: form.id }, transaction: t }
                );
            }
        }

        await t.commit();
        return serviceRequest;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const saveFirstStepData = async (userID, person, requestID) => {
    try {
        const dataSave = { person_data: person, id_user: userID };

        const request = await db.Service_Request.update(dataSave, {
            where: { id: requestID },
        });

        return request;
    } catch (error) {
        throw error;
    }
};

const getRequestServiceByUser = async (userID) => {
    const requests = await db.Service_Request.findAll({
        where: { id_user: userID, return_later: 1 },
        include: [
            {
                association: 'ServiceItems',
            },
        ],
    });

    return requests;
};

const updateRequestService = async (data) => {
    const t = await db.sequelize.transaction();
    try {
        const { serviceRequest, person, ServiceItems } = data;
        if (serviceRequest) {
            await db.Service_Request.update(serviceRequest, {
                where: { id: serviceRequest.id },
                transaction: t,
            });
        }
        if (person) {
            const people = {
                id: person.id,
                procoop_last_name: person.procoop_last_name,
                email: person.email,
                number_customer: person.number_customer,
                type_person: person.type_person,
                situation_tax: person.situation_tax,
                fixed_phone: ``,
            };
            await db.People.update(person, {
                where: { id: person.id },
                transaction: t,
            });
        }
        await t.commit();
        return requestService;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const getRequestServiceData = async (requestID) => {
    const request = await db.Service_Request.findByPk(requestID, {
        include: [
            {
                association: 'ServiceItems',
            },
            {
                association: 'People',
                include: [
                    {
                        association: 'Person_physical',
                    },
                    {
                        association: 'Person_legal',
                    },
                ],
            },
        ],
    });

    return request;
};
module.exports = {
    createRequestService,
    getRequestServiceByUser,
    updateRequestService,
    getRequestServiceData,
    returnLaterService,
    saveFirstStepData,
};
