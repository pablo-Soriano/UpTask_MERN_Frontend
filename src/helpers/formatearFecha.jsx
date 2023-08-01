
export const formatearFecha = fecha => {
    // se agrega a la fecha split('T')[0].split('-') porque sino muestra el nombre del dia, con un dia anterior, al de la fecha guardada en la base de datos, es falla de la funcion, se formatea y con el split('-') separa la fecha y asi lo interpreta mejor
    const nuevaFecha = new Date(fecha.split('T')[0].split('-'))

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return nuevaFecha.toLocaleDateString('es-ES', opciones)
}