const formatDate = (date) => {
	const fechaActual = new Date(date)
	const anio = fechaActual.getFullYear()
	const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0') // Asegura que el mes tenga 2 dígitos
	const dia = fechaActual.getDate().toString().padStart(2, '0') // Asegura que el día tenga 2 dígitos

	const fechaFormateada = `${anio}-${mes}-${dia}`
	return fechaFormateada
}
module.exports = {
	formatDate,
}
