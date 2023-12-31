import React from 'react'

const Alerta = ({parametro}) => {
  return (
    <div className={`${parametro.error ? 'from-red-400 to-red-600'  : 'from-sky-400 to-sky-600' } bg-gradient-to-br text-center p-3 rounded-xl text-white font-bold text-sm my-10`}>
        {parametro.msg}
    </div>
  )
}

export default Alerta