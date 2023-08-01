import React from 'react';
import FormularioColaborador from './FormularioColaborador';
import { useEffect } from 'react';
import useProyectos from '../../hooks/useProyectos';
import { useParams } from 'react-router-dom';
import Alerta from '../../Auth/components/Alerta';

const NuevoColaborador = () => {
    const {obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta} = useProyectos();
    const params = useParams();

    useEffect( ()=> {
        obtenerProyecto(params.id);
    }, []);
    
  if(!proyecto?._id) return <Alerta parametro={alerta} />

  return (
    <>
        <h1 className='text-4xl font-black text-center'>Añadir Colaborador al Proyecto: <br /> <span className="text-sky-700">{proyecto.nombre}</span> </h1>

        <div className='mt-10 flex justify-center'>
            <FormularioColaborador />
        </div>

        {cargando ? <p className="text-center">cargando...</p> : colaborador?._id && (
           <div className='flex justify-center mt-10'>
            <div className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full'>
              <h2 className='text-center mb-10 text-2xl font-bold'>Resultado:</h2>

              <div className='flex justify-between items-center'>
                {colaborador.nombre}

                <button type='button' onClick={() => agregarColaborador({email: colaborador.email})} className='bg-slate-500 px-5 py-2 rounded-lg text-white font-bold text-sm'>Agregar al Proyecto</button>
              
              </div>
            </div>
           </div>
        )}
    </>
  )
}

export default NuevoColaborador