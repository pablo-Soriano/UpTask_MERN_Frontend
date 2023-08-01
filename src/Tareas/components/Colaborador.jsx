import React from 'react';
import useProyectos from '../../hooks/useProyectos';

const Colaborador = ({colaborador}) => {
  const {handleModalEliminarColaborador } = useProyectos();

  const { nombre, email } = colaborador;
  
    return (
    <div className='border-b p-5 flex justify-between items-center'>
        <div>
            <p>{nombre}</p>
            <p className='text-sm text-gray-700'>{email}</p>
        </div>
        <div>
            <button type="button" className='bg-red-600 px-2 py-2 text-white font-bold text-sm rounded-lg hover:bg-red-800' title='Eliminar Colaborador' onClick={ () => handleModalEliminarColaborador(colaborador) }>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
            </button>
        </div>
    </div>
  )
}

export default Colaborador