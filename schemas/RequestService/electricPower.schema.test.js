const { z } = require('zod')
const { electricFormSchema } = require('./electricPower.schema')

// FILE: schemas/RequestService/electricPower.schema.test.js

describe('electricFormSchema', () => {
    test('valid data', () => {
        const validData = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '1',
            typeGarante: '1',
            dniGarante: '1234567',
        }
        expect(() => electricFormSchema.parse(validData)).not.toThrow()
    })

    test('missing required fields', () => {
        const invalidData = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
        }
        expect(() => electricFormSchema.parse(invalidData)).toThrow()
    })

    test('conditional fields - propietarioInmueble', () => {
        const invalidData = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '2',
            typeGarante: '1',
            dniGarante: '1234567',
        }
        expect(() => electricFormSchema.parse(invalidData)).toThrow()

        const validData = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '2',
            nameProperty: 'John',
            lastNameProperty: 'Doe',
            numberDocProperty: '1234567',
            typeGarante: '1',
            dniGarante: '1234567',
        }
        expect(() => electricFormSchema.parse(validData)).not.toThrow()
    })

    test('conditional fields - typeGarante', () => {
        const invalidData = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '1',
            typeGarante: '1',
        }
        expect(() => electricFormSchema.parse(invalidData)).toThrow()

        const validData = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '1',
            typeGarante: '1',
            dniGarante: '1234567',
        }
        expect(() => electricFormSchema.parse(validData)).not.toThrow()
    })

    test('edge cases for string lengths', () => {
        const invalidDataShort = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '2',
            nameProperty: 'Jo',
            lastNameProperty: 'Do',
            numberDocProperty: '1234567',
            typeGarante: '1',
            dniGarante: '1234567',
        }
        expect(() => electricFormSchema.parse(invalidDataShort)).toThrow()

        const invalidDataLong = {
            typeProcedure: '1',
            typeActivity: '1',
            meterType: '1',
            residenceAddress: '1',
            propietarioInmueble: '2',
            nameProperty: 'J'.repeat(101),
            lastNameProperty: 'D'.repeat(101),
            numberDocProperty: '1234567',
            typeGarante: '1',
            dniGarante: '1234567',
        }
        expect(() => electricFormSchema.parse(invalidDataLong)).toThrow()
    })
})
