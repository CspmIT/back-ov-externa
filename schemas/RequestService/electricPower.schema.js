const { z } = require('zod')
const {
    createPositiveIntegerStringSchema,
} = require('../createPostiveIntegerString.schema')
const { propertySchema } = require('./property.schema')

const electricFormSchema = z
    .object({
        id_service_form: z.number().optional(),
        typeProcedure: createPositiveIntegerStringSchema('Tipo de trámite'),
        typeActivity: createPositiveIntegerStringSchema('Tipo de actividad'),
        meterType: createPositiveIntegerStringSchema('Tipo de medidor'),
        propietarioInmueble: createPositiveIntegerStringSchema(
            'El propietario del inmueble'
        ),
        // Si el propietario del inmueble es falso, se debe llenar el siguiente campo
        nameProperty: z.string().optional(),
        lastNameProperty: z.string().optional(),
        numberDocProperty: z.string().optional(),
        typeGarante: createPositiveIntegerStringSchema('Tipo de garante'),
        // Si el tipo de garante es 1 se debe llenar el siguiente campo
        dniGarante: z.string().optional(),
    })
    .strip()
    .refine((data) => {
        console.log(data)
        if (data.typeActivity === 2 && !data.residenceAddress) {
            throw new Error(
                'Debe indicar si la dirección del domicilio es la misma que la del solicitante'
            )
        }
        // Si el propietario del inmueble es diferente a 1, debe tener nombre, apellido y dni
        if (data.propietarioInmueble === 2) {
            const property = {
                nameProperty: data.nameProperty,
                lastNameProperty: data.lastNameProperty,
                numberDocProperty: data.numberDocProperty,
            }
            try {
                const response = propertySchema.safeParse(property)
                if (!response.success) {
                    throw new Error(
                        response.error.issues.map((error) => error.message)
                    )
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }
        if (data.typeGarante === 1 && !data.dniGarante) {
            throw new Error('Debe indicar el DNI del garante')
        }
        return true
    })

module.exports = { electricFormSchema }
