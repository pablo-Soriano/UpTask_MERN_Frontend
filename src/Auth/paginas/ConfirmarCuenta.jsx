import  { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import baseUrlAxios from "../../config/baseUrlAxios";
import Alerta from "../components/Alerta";

const ConfirmarCuenta = () => {
  const params = useParams();
  const { id } = params;

  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const ConfirmarCuentaUser = async () => {
    try {
      const url = `/api/usuarios/confirmar/${id}`;
      const { data } = await baseUrlAxios.get(url);

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setCuentaConfirmada(true);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  useEffect(() => {
    ConfirmarCuentaUser();
  }, []);



  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl text-center">
        Confirma tu Cuenta y Crea{" "}
        <span className="text-slate-700">tus proyectos</span>
      </h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alerta parametro={alerta} />}

        {cuentaConfirmada && (<Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'>Inicia Sesión</Link>)}
      
      </div>
    </>
  );
};

export default ConfirmarCuenta;
