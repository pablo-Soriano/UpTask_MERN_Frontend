import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Proyectos from '../paginas/Proyectos';
import RutaProtegida from '../layouts/RutaProtegida';
import NuevoProyecto from '../paginas/NuevoProyecto';
import { ProyectosProvider } from '../../context/ProyectosProvider';
import Proyecto from '../paginas/Proyecto';
import EditarProyecto from '../paginas/EditarProyecto';
import NuevoColaborador from '../../Tareas/components/NuevoColaborador';

const RouteProyecto = () => {
  return (
    <Routes > 
        <Route path="/" element={<RutaProtegida />} >
           <Route index element={<Proyectos />} />
           <Route path='crear-proyecto' element={<NuevoProyecto />} />
           <Route path='nuevo-colaborador/:id' element={<NuevoColaborador />} />
           <Route path=':id' element={<Proyecto />} />
           <Route path='editar/:id' element={<EditarProyecto />} />
        </Route>

    </Routes>
  )
}

export default RouteProyecto