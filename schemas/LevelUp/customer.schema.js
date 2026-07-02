const { z } = require('zod')

const customerSchema = z.object({
    number_customer: z
        .number({ message: 'El numero de socio es requerido' })
        .int({ message: 'El numero de socio no puede ser decimal' })
        .positive({ message: 'El numero de socio no puede ser negativo' }),
    name_customer: z.string({ message: 'El nombre del socio es requerido' }),
    document_type: z
        .number({ message: 'El tipo de documento es requerido' }) 
        .int({ message: 'El tipo de documento no puede ser decimal' })
        .positive({ message: 'El tipo de documento no puede ser negativo' }),
    document_number: z
        .number({ message: 'El numero de documento es requerido' })
        .int({ message: 'El numero de documento no puede ser decimal' })
        .positive({ message: 'El numero de documento no puede ser negativo' }),
    id_state: z
        .number({ message: 'La provincia es requerida' })
        .int({ message: 'La provincia no puede ser decimal' })
        .positive({ message: 'La provincia no puede ser negativa' }),
    id_city: z
        .number({ message: 'La ciudad es requerida' })
        .int({ message: 'La ciudad no puede ser decimal' })
        .positive({ message: 'La ciudad no puede ser negativa' }),
    id_street: z
        .number({ message: 'La calle es requerida' })
        .int({ message: 'La calle no puede ser decimal' })
        .positive({ message: 'La calle no puede ser negativa' }),
    number_address: z
        .number({ message: 'El numero de direccion es requerido' })
        .int({ message: 'El numero de direccion no puede ser decimal' })
        .positive({ message: 'El numero de direccion no puede ser negativo' }),
    phoneCaract: z
        .number({
            message: 'El caracteristica del telefono es requerido',
        })
        .int({ message: 'El caracteristica del telefono no puede ser decimal' })
        .positive({
            message: 'El caracteristica del telefono no puede ser negativo',
        }),
    numberPhone: z
        .number({ message: 'El numero de telefono es requerido' })
        .int({ message: 'El numero de telefono no puede ser decimal' })
        .positive({ message: 'El numero de telefono no puede ser negativo' }),
    birthdate: z
        .string({ message: 'La fecha de nacimiento es requerida' })
        .date({ message: 'La fecha de nacimiento no es valida' }),
    sex: z
        .number({ message: 'El sexo no es valido' })
        .int({ message: 'El sexo no puede ser decimal' })
        .positive({ message: 'El sexo no puede ser negativo' })
        .nullable()
        .optional(),
    id: z
        .number({ message: 'El id del usuario es requerido' })
        .int({ message: 'El id del usuario no puede ser decimal' })
        .positive({ message: 'El id del usuario no puede ser negativo' }),
    level: z
        .number({ message: 'El nivel de usuario es requerido' })
        .int({ message: 'El nivel de usuario no puede ser decimal' })
        .positive({ message: 'El nivel de usuario no puede ser negativo' }),
})

module.exports = { customerSchema }
