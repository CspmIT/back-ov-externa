const { z } = require('zod')
/**
 * Crea un esquema de validación para una cadena que representa un entero positivo.
 *
 * @param {string} fieldName - El nombre del campo que se está validando.
 * @param {boolean} [fullMessage=false] - Mensaje completo de error si la validación falla.
 * @returns {object} - Esquema de validación de Zod.
 *
 * @example
 * const schema = createPositiveIntegerStringSchema('edad');
 * schema.parse('25'); // Retorna 25
 *
 * @example
 * const schema = createPositiveIntegerStringSchema('edad', 'Cualquier mennsaje de error');
 * schema.parse('Esto no es un número'); // return message: Cualquier mensaje de error.
 *
 * @author
 * Agustin Comba
 */
const createPositiveIntegerStringSchema = (fieldName, fullMessage = false) => {
    let schema = z.string({
        message: fullMessage ? fullMessage : `${fieldName} es requerido`,
    })

    return schema
        .transform((val) => parseInt(val, 10))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: `${fieldName} el tipo de dato no es válido`,
        })
}

module.exports = { createPositiveIntegerStringSchema }
