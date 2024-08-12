const userDesarrollo = require('../models/userDesarrollo')

const listUser = async () => {
    const users = await userDesarrollo.findAll()
    if (!users) {
        throw new Error('El usuario no existe')
    }
    const data = users.map((user) => user.get())
    return data
}

module.exports = {
    listUser
}
