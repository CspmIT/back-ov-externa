const { z } = require('zod')

const RequestServiceSchema = z.object({
    residencia: z.boolean({message: 'La residencia es requerida'}),
    hasEnergy: z.boolean({message: 'La energía es requerida'}),
    sepelio: z.boolean({message: 'El tipo de sepelio no es válido'}).optional(),
    banco: z.boolean({message: 'El tipo de banco de sangre no es válido'}).optional(),
})