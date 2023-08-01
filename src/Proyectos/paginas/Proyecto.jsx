import {React, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import useProyectos from '../../hooks/useProyectos';
import useAdmin from '../../hooks/useAdmin';
import ModalFormularioTarea from '../../Tareas/components/ModalFormularioTarea';
import ModalEliminarTarea from '../../Tareas/components/ModalEliminarTarea';
import ModalEliminarColaborador from '../../Tareas/components/ModalEliminarColaborador';
import Tarea from '../../Tareas/components/Tarea';
import Alerta from '../../Auth/components/Alerta';
import Colaborador from '../../Tareas/components/Colaborador';
import { io } from 'socket.io-client';

let socket;

const Proyecto = () => {
    const params = useParams();
    const {obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea} = useProyectos();
    const admin = useAdmin();
    
    useEffect( () => {
        obtenerProyecto(params.id);
    },[])

    //useEffect para socket.io
    useEffect( () => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', params.id);

    }, [])

    useEffect( () => {
        socket.on('tarea agregada', tareaNueva => {
            if(tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva);
            }
        });

        socket.on('tarea eliminada', tareaEliminada => {
            if(tareaEliminada.proyecto = proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        });

        socket.on('tarea actualizada', tareaActualizada => {
            if(tareaActualizada.proyecto === proyecto._id) {
                actualizarTareaProyecto(tareaActualizada);
            }
        });

        socket.on('nuevo estado', nuevoEstadoTarea => {
            if(nuevoEstadoTarea.proyecto._id === proyecto._id){
                cambiarEstadoTarea(nuevoEstadoTarea);
            }
        })
    })

    const {nombre} = proyecto;
        
  return (
        cargando ? '...' : (
            <>
                <div className='flex justify-between'>
                    <h1 className='font-black text-4xl'>{nombre}</h1>

                    {admin && (
                    <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>

                    <Link to={`/proyectos/editar/${params.id}`} className='font-bold'>Editar</Link>

                    </div>
                    )}
                </div>

            {admin && (
                <button onClick={ handleModalTarea} type='button' className='text-sm bg-sky-400 px-5 py-3 w-full md:w-auto rounded-lg font-bold text-white text-center mt-5 flex gap-2 items-center justify-center'>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    Nueva Tarea
                </button>
            )}


                <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

                <div className='bg-white shadowmt-10 rounded-lg'>
                    {proyecto.tareas?.length ? proyecto.tareas?.map( tarea => (
                        <Tarea key={tarea._id} tarea={tarea} />
                    )) : <p className='text-center my-5 p-10'>No hay Tareas en este Proyecto</p>}
                </div>
            
            {admin && (
                <>
                <div className='flex items-center justify-between mt-10 mb-3'>
                    <p className='font-bold text-xl'>Colaboradores</p>
                    <div className='bg-green-600 px-1 py-1 text-white font-bold text-sm rounded-lg'>
                        <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`} className='text-white-400 font-bold hover:text-black' title='Añadir Colaborador'>
                        
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        
                        </Link>
                    </div>
                </div>

                <div className='bg-white shadowmt-10 rounded-lg'>
                    {proyecto.colaboradores?.length ? proyecto.colaboradores?.map( colaborador => (
                        <Colaborador key={colaborador._id} colaborador={colaborador}  />
                    )) : <p className='text-center my-5 p-10'>No hay Colaboradores en este Proyecto</p>}
                </div>
                </>
            )}

                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />

            </>
    )
  )
  
}

export default Proyecto