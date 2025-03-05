const { z } = require('zod')

const propertySchema = z.object({
    nameProperty: z
        .string({
            message: 'El nombre del propietario es requerido',
        })
        .min(3, {
            message:
                'El nombre del propietario debe tener al menos 3 caracteres',
        })
        .max(50, {
            message:
                'El nombre del propietario debe tener menos de 50 caracteres',
        }),
    lastNameProperty: z
        .string({
            message: 'El apellido del propietario es requerido',
        })
        .min(3, {
            message:
                'El apellido  del propietario debe tener al menos 3 caracteres',
        })
        .max(50, {
            message:
                'El apellido  del propietario debe tener menos de 50 caracteres',
        }),
    numberDocProperty: z
        .string({
            message: 'El número de documento  del propietario es requerido',
        })
        .min(7, {
            message:
                'El número de documento  del propietario debe tener al menos 7 caracteres',
        })
        .max(8, {
            message:
                'El número de documento  del propietario debe tener menos de 8 caracteres',
        }),
})

module.exports = { propertySchema }
