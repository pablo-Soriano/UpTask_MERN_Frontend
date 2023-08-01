import {React, useState, useEffect, createContext} from 'react';
import baseUrlAxios from '../config/baseUrlAxios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { io } from 'socket.io-client';

let socket;

const ProyectosContext = createContext();

export const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [buscador, setBuscador] = useState(false);

    const navigate = useNavigate();
    const {auth} = useAuth();



    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) return
    
                // se crea el headers...
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await baseUrlAxios.get('/api/proyectos', config);
                setProyectos(data);
                
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos();
    }, [auth]);

    // useEffect para socket-io
    useEffect( () => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, []);


    //funcion para alerta
    const mostrarAlerta = alerta => {
        setAlerta(alerta);
        setTimeout(() => {
            setAlerta({});
        }, 5000)
    }

    const submitProyecto = async proyecto => {

        if(proyecto.id){
          await editarProyecto(proyecto);
        }else{
          await NuevoProyecto(proyecto);
        }
        return
        
    }

    // Editar un proyecto
    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            // consumo de API para edicion de proyecto. 
            const {data} = await baseUrlAxios.put(`/api/proyectos/${proyecto.id}`, proyecto, config);

            //sincronizar el state.  busca el Id que estoy editando con la info de la bd y al encontrarlo actualiza la informacion por el de la bd, los demas como no esta el Id editado, muestra los del state, asi es como se muestra la actualizacion de datos en la vista
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados);

            //Mostrar alerta de edicion de proyecto
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            // se coloca 3 segundos para mostrar alerta y se redirige a la ruta de proyectos.
            navigate(`/proyectos/${proyecto.id}`);

            setTimeout(() => {
                setAlerta({});

            }, 3000)
            // Redireccionar
        } catch (error) {
            console.log(error);
        }
    }

    // Crear nuevo proyecto
    const NuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            // consumo de API para creacion de proyecto nuevo. (para un post el orden es: url, datos, configuracion)
            const {data} = await baseUrlAxios.post('/api/proyectos', proyecto, config);

            //Se actualiza el State y tambien actualiza la vista, para no volver a consultar la bd ni tener que recargar la pagina, toma una copia de la base y le agrega el ultimo registro.
            setProyectos([...proyectos, data]);

            //Mostrar alerta de creacion de proyecto
            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })
            navigate('/proyectos');

            // se coloca 3 segundos para mostrar alerta y se redirige a la ruta de proyectos.
            setTimeout(() => {
                setAlerta({});
            }, 3000) 
 
        } catch (error) {
            console.log(error);
        }
    }

    //obtener un proyecto por su Id.
    const obtenerProyecto = async id => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.get(`/api/proyectos/${id}`, config);
            setProyecto(data);
            setAlerta({});
        } catch (error) {
            navigate('/proyectos');
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });

            setTimeout(() => {
                setAlerta({});
            }, 3000);
        }

        setCargando(false);
    }

    const eliminarProyecto = async id =>{
       try {
        const token = localStorage.getItem('token');
        if(!token) return

        // se crea el headers...
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const {data} = await baseUrlAxios.delete(`/api/proyectos/${id}`, config);

        // sincroniza el state
        const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id);
        setProyectos(proyectosActualizados);

        setAlerta({
            msg: data.msg,
            error: false
        })

        // se coloca 3 segundos para mostrar alerta y se redirige a la ruta de proyectos.
        setTimeout(() => {
            setAlerta({});
            navigate('/proyectos');
            }, 3000)

       } catch (error) {
        console.log(error);
       }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({});
    }

    const submitTarea = async tarea => {

        if(tarea?.id) {
           await editarTarea(tarea);
        } else {
           await crearTarea(tarea);
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.post('/api/tareas', tarea, config);
            
            //se comentarea este codigo, que es para actualizar state y se pasa a la funcion...socket io: submitTareasProyecto, aqui se hara esa parte para actualizar la tarea a todos los usuarios que esten en ese proycecto.
/*             // Agrega la tarea al State (para que se actualice la vista), se toma una copia de proyecto
            const proyectoActualizado = {...proyecto}
            // se toma una copia de las tareas y se agrega la nueva tarea, al final de este arreglo.
            proyectoActualizado.tareas = [...proyecto.tareas, data]

            // se actualiza el state y se muestra en la vista
            setProyecto(proyectoActualizado); */
            //se limpian las alertas
            setAlerta({});
            //se cierra el modal
            setModalFormularioTarea(false);

            //SOCKET IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error);
        }
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.put(`/api/tareas/${tarea.id}`, tarea, config);
            //se comentarea este codigo, porque se para a socket io en funcion: 

/*             //actualizar el DOM(state)
                // se toma una copia de proyecto
            const proyectoActualizado = {...proyecto};
            // se itera sobre las tareas del proyecto
            proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState);
            //se actualiza el state
            setProyecto(proyectoActualizado); */

            //se limpia la alerta
            setAlerta({});
            // se cierra el modal
            setModalFormularioTarea(false);
            

            //SOCKET IO
            socket.emit('actualizar tarea', data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.delete(`/api/tareas/${tarea._id}`, config);

            //se limpia la alerta
            setAlerta({
                msg:data.msg,
                error: false
            });
            // se comentarea este codigo, para trasladarlo a una funcion socket io, en tiempo real: funcion: 
    /*         //actualizar el DOM(state)
                // se toma una copia de proyecto
            const proyectoActualizado = {...proyecto};
            // este codigo trae las tareas que sean diferentes al que se eliminó, para mostrar las tareas que quedan.
            proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id )

            //se actualiza el state
            setProyecto(proyectoActualizado); */

            // se cierra el modal
            setModalEliminarTarea(false);
            
            // SOCKET IO
            socket.emit('eliminar tarea', tarea);
           
           
            setTarea({});

            // se coloca 3 segundos para mostrar alerta y se redirige a la ruta de proyectos.
            setTimeout(() => {
            setAlerta({});
            }, 3000)

        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async email => {
        setCargando(true);
    
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.post('/api/proyectos/colaboradores', {email}, config);

            setColaborador(data);
            setAlerta({})
            
            /* //se limpia la alerta
            setAlerta({
                msg:data.msg,
                error: false
            });
 */         
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });

            setTimeout(() => {
                setAlerta({});
                }, 3000)
        }
        setCargando(false);
    }

    //Agreagar colaborador a un proyecto
    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.post(`/api/proyectos/colaboradores/${proyecto._id}`, email, config);
            // mostrar alerta
            setAlerta({
                msg: data.msg,
                error: false
            });

            setColaborador({});
            navigate(`/proyectos/${proyecto._id}`);

            // quitamos la alerta
            setTimeout(() => {
                setAlerta({});
                }, 3000)   
            
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
            setColaborador({});
            // limpia las alertas
            setTimeout(() => {
                setAlerta({});
                },4000)   

        }
    }
    
    // Modal Eliminar Colaborador
    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador);

        setColaborador(colaborador);
    }

    // funcion eliminar Colaborador
    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            const {data} = await baseUrlAxios.post(`/api/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);

            //se actualiza el state para actualizar la vista, primero tomamos una copia de proyecto
            const proyectoActualizado = {...proyecto}
            // usamos filter, para eliminar del state el colaborador, accedemos al colaborador del state y le decimos que queremos traer los que son diferentes a colaborador._id, que es el que eliminamos.
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)

            //actualiza el state
            setProyecto(proyectoActualizado);

            setAlerta({
                msg: data.msg,
                error: false
            });

            setColaborador({});
            setModalEliminarColaborador(false);
            setTimeout( () => {
                setAlerta({});
            }, 3000)
        } catch (error) {
            console.log(error.response);
        }
    }


    //Funcion que cambia estado a tareas
    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token');
            if(!token) return

            // se crea el headers...
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await baseUrlAxios.post(`/api/tareas/estado/${id}`, {}, config);
            /* se comentarea este codigo y se pasa al socket io, en la funcion: 
            // se actualiza el state para hacerlo mas dinamico
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState);
            setProyecto(proyectoActualizado)
             */
            setTarea({});
            setAlerta({})

            //SOCKET IO
            socket.emit('cambiar estado', data);
            
        } catch (error) {
         console.log(error.response);   
        }
    }

    //modal buscador
    const handleBuscador = () =>{
        setBuscador(!buscador);
    }

    // SOCKET IO
    const submitTareasProyecto = (tarea) => {
        // Agrega la tarea al State (para que se actualice la vista), se toma una copia de proyecto
        const proyectoActualizado = {...proyecto}
        // se toma una copia de las tareas y se agrega la nueva tarea, al final de este arreglo.
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

        // se actualiza el state y se muestra en la vista
        setProyecto(proyectoActualizado);
    }

    const eliminarTareaProyecto = tarea => {
        //actualizar el DOM(state)
        // se toma una copia de proyecto
        const proyectoActualizado = {...proyecto};
        // este codigo trae las tareas que sean diferentes al que se eliminó, para mostrar las tareas que quedan.
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id )

        //se actualiza el state
        setProyecto(proyectoActualizado);
    }

    const actualizarTareaProyecto = tarea => {
        //actualizar el DOM(state)
        // se toma una copia de proyecto
        const proyectoActualizado = {...proyecto};
        // se itera sobre las tareas del proyecto
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState);
        //se actualiza el state
        setProyecto(proyectoActualizado);
    }

    const cambiarEstadoTarea = tarea => {
        // se actualiza el state para hacerlo mas dinamico
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState);
            setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        > {children}
        
        </ProyectosContext.Provider>
    )
}

export default ProyectosContext;