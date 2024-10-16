const { z } = require('zod');

// {
//     typePerson: '1',
//     id: 21,
//     DNI: '41240962',
//     name: 'Agustin',
//     last_name: 'Comba',
//     SEXO: '2',
//     TIP_DNI: '1',
//     NUM_DNI: '41240962',
//     dia: '19',
//     mes: '02',
//     'año': '1999',
//     EMAIL: 'agucomba@gmail.com',
//     characteristic: '3562',
//     number: '459440',
//     caracteristicaFijo: '',
//     numeroFijo: '',
//     COD_SIT: 4
//   }
const createPositiveIntegerStringSchema = (fieldName) => {
    return z
        .string({ message: `${fieldName} es requerido` })
        .transform((val) => parseInt(val, 10))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: `${fieldName} el tipo de dato no es válido`,
        });
};
const PersonRequestSchema = z.object({
    // transformo de string a number
    typePerson: createPositiveIntegerStringSchema('Tipo de persona'),
    name: z
        .string({ message: 'El nombre es requerido' })
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(200, 'El nombre debe tener como máximo 200 caracteres'),
    last_name: z
        .string({ message: 'El apellido es requerido' })
        .min(3, 'El apellido debe tener al menos 3 caracteres')
        .max(200, 'El apellido debe tener como máximo 200 caracteres'),
    SEXO: createPositiveIntegerStringSchema('El sexo'),
    TIP_DNI: createPositiveIntegerStringSchema('El tipo de documento'),
    NUM_DNI: z
        .string({ message: 'El número de documento es requerido' })
        .min(7, 'El número de documento debe tener al menos 7 caracteres')
        .max(9, 'El número de documento debe tener como máximo 8 caracteres'),
    dia: z
        .string({ message: 'El día es requerido' })
        .min(1, 'El día debe tener al menos 1 caracter')
        .max(2, 'El día debe tener como máximo 2 caracteres'),
    mes: z
        .string({ message: 'El mes es requerido' })
        .min(1, 'El mes debe tener al menos 1 caracter')
        .max(2, 'El mes debe tener como máximo 2 caracteres'),
    año: z
        .string({ message: 'El año es requerido' })
        .min(4, 'El año debe tener al menos 4 caracteres')
        .max(4, 'El año debe tener como máximo 4 caracteres'),
    EMAIL: z
        .string({ message: 'El correo electrónico es requerido' })
        .email({ message: 'El correo electrónico no es válido' }),
    characteristic: z.string({ message: 'La característica es requerida' }),
    number: z.string({ message: 'El número es requerido' }),
    caracteristicaFijo: z.string().nullable(), // Permitir null
    numeroFijo: z.string().nullable(), // Permitir null
    COD_SIT: createPositiveIntegerStringSchema('La situación fiscal'),
});

const PersonPhysicalSchema = z.object({
    name: z
        .string({ message: 'El nombre es requerido' })
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(200, 'El nombre debe tener como máximo 200 caracteres'),
    last_name: z
        .string({ message: 'El apellido es requerido' })
        .min(3, 'El apellido debe tener al menos 3 caracteres')
        .max(200, 'El apellido debe tener como máximo 200 caracteres'),
    type_dni: z
        .number({ message: 'El tipo de documento es requerido' })
        .int({ message: 'El tipo de documento debe ser entero' })
        .positive({ message: 'El tipo de documento no es válido' }),
    num_dni: z
        .number({ message: 'El número de documento es requerido' })
        .min(7, 'El número de documento debe tener al menos 7 caracteres')
        .max(9, 'El número de documento debe tener como máximo 8 caracteres'),
    born_date: z.string().datetime('La fecha de nacimiento es requerida'),
    id_type_sex: z.number().int().positive('El sexo es requerido'),
    blood_type: z.string().nullable(), // Permitir null
    factor: z.string().nullable(), // Permitir null
    donor: z.boolean().nullable(), // Permitir null
    validation_renaper: z.boolean().nullable(),
    id_person: z.number().int().positive().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

const PersonDataSchema = z
    .object({
        type_person: z
            .number({
                message: 'El tipo de persona es requerido',
            })
            .int('El tipo de persona debe ser un número entero')
            .positive('El tipo de persona debe ser un número positivo'),
        type_document: z
            .number({
                message: 'El tipo de documento es requerido',
            })
            .int('El tipo de documento debe ser un número entero')
            .positive('El tipo de documento debe ser un número positivo'),
        number_document: z
            .string({ message: 'El número de documento es requerido' })
            .min(7, 'El número de documento debe tener al menos 7 caracteres')
            .max(
                8,
                'El número de documento debe tener como máximo 9 caracteres'
            ),
        email: z
            .string({ message: 'El correo electrónico es requerido' })
            .email('El correo electrónico no es válido'),
        cell_phone: z
            .string({ message: 'El número de celular es requerido' })
            .min(10, 'El número de celular debe tener al menos 10 caracteres')
            .max(
                13,
                'El número de celular debe tener como máximo 13 caracteres'
            ),
        situation_tax: z
            .number({
                message: 'La situación fiscal es requerida',
            })
            .int('La situación fiscal debe ser un número entero')
            .positive('La situación fiscal debe ser un número positivo'),
        Person_physical: PersonPhysicalSchema.optional(),
    })
    .refine(
        (data) => {
            if (data.type_person === 1) {
                const result = PersonPhysicalSchema.safeParse(
                    data.Person_physical
                );
                return result.success;
            }
            return true;
        },
        {
            message: 'Los datos de la persona física son requeridos',
            path: ['Person_physical'],
        }
    );

module.exports = { PersonDataSchema, PersonRequestSchema };
