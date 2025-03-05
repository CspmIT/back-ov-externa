const { z } = require('zod')

const {
    createPositiveIntegerStringSchema,
} = require('../createPostiveIntegerString.schema')

const ConnectionAddressSchema = z.object({
    lat: z
        .number({ message: 'El valor de la latitud no es el correcto' })
        .optional(),
    lng: z
        .number({ message: 'El valor de la longitud no es el correcto' })
        .optional(),
    provincia: createPositiveIntegerStringSchema('El campo provincia'),
    city: createPositiveIntegerStringSchema('El campo ciudad'),
    street: z.number({ message: 'La calle es requerida' }),
    numberAddress: createPositiveIntegerStringSchema('El número de dirección'),
    circ: createPositiveIntegerStringSchema('El campo circ'),
    sec: createPositiveIntegerStringSchema('El campo sec'),
    man: createPositiveIntegerStringSchema('El campo man'),
    par: createPositiveIntegerStringSchema('El campo par'),
    ph: createPositiveIntegerStringSchema('El campo ph'),
    lote: createPositiveIntegerStringSchema('El campo lote'),
})

module.exports = { ConnectionAddressSchema }
