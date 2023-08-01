import React from "react";
import { useEffect } from "react";
import useProyectos from "../../hooks/useProyectos";
import PreviewProyecto from "../components/PreviewProyecto";
import Alerta from "../../Auth/components/Alerta";


const Proyectos = () => {
  const { proyectos, alerta, setAlerta } = useProyectos();
  
 
  const { msg } = alerta;


  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      {msg && <Alerta parametro={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ? (
          proyectos.map((proyecto) => (
            <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
          ))
        ) : (
          <p className="text-center text-gray-600 uppercase p-5">
            No hay Proyectos aún!
          </p>
        )}
      </div>
    </>
  );
};

export default Proyectos;
