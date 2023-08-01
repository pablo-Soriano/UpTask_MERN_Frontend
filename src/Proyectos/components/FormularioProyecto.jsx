import { Input } from 'postcss'
import {React, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import useProyectos from '../../hooks/useProyectos';
import Alerta from '../../Auth/components/Alerta';

const FormularioProyecto = () => {

  const datosProyecto = {
    nombre: "",
    descripcion: "",
    fechaEntrega: "",
    cliente: ""
  }

  const [id, setId] = useState(null);
  const [agregarProyecto, setAgregarProyecto] = useState(datosProyecto);
  const {nombre, descripcion, fechaEntrega, cliente} = agregarProyecto;
  const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos();


  const params = useParams();
  
  // con esto validamos si hay un id en la url, es editar, sino es Crear nuevo registro
  useEffect( () => {
    if(params.id){
      setAgregarProyecto(proyecto)
      setId(proyecto._id);
    }
  }, [params])

  const capturarDatosProyecto = (e) => {
    e.preventDefault();
    setAgregarProyecto({
      ...agregarProyecto,
      [e.target.name]: e.target.value, // asigna valores acada campo del formulario
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
      mostrarAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }
    // Pasa los datos hacia el Provider
    await submitProyecto({id,nombre, descripcion, fechaEntrega, cliente})
    setAgregarProyecto(datosProyecto);
    setId(null);
  }

  const {msg} = alerta;

  return (
    <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
        {msg && <Alerta parametro={alerta} />}

        <div className='mb-5'>
            <label className='text-gray-700 uppercase fornt-bold text-sm' htmlFor='nombre'>Nombre Proyecto</label>
            <input 
              type='text' id='nombre' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
              placeholder='Nombre del Proyecto' value={nombre} name='nombre' onChange={capturarDatosProyecto} 
            />
        </div>
        <div className='mb-5'>
            <label className='text-gray-700 uppercase fornt-bold text-sm' htmlFor='descripcion'>Descripción</label>
            <textarea 
              id='descripcion' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
              placeholder='Descripción del Proyecto' value={descripcion} name='descripcion' onChange={capturarDatosProyecto} 
            />
        </div>
        <div className='mb-5'>
            <label className='text-gray-700 uppercase fornt-bold text-sm' htmlFor='fecha-entrega'>Fecha Entrega</label>
            <input 
              type="date" id='fecha-entrega' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
              value={fechaEntrega.split('T')[0]} name='fechaEntrega' onChange={capturarDatosProyecto} 
            />
        </div>
        <div className='mb-5'>
            <label className='text-gray-700 uppercase fornt-bold text-sm' htmlFor='cliente'>Nombre Cliente</label>
            <input 
              type='text' id='cliente' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
              placeholder='Nombre del cliente' value={cliente} name='cliente' onChange={capturarDatosProyecto} 
            />
        </div>
        <input type='submit' value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'} className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors' />
    </form>
  )
}

export default FormularioProyecto