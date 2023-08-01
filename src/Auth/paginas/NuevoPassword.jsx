import {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import baseUrlAxios from '../../config/baseUrlAxios';
import Alerta from '../components/Alerta';


const NuevoPassword = () => {

  const [password, setPassword] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [passwordModificado, setPasswordModificado] = useState(false);

  const params = useParams();
  const {token} = params;

  useEffect(() => {
      const comprobarToken = async () => {
        try {
          await baseUrlAxios.get(`/api/usuarios/olvide-password/${token}`);
          setTokenValido(true);
        } catch (error) {
          setAlerta({
            msg: error.response.data.msg,
            error: true
          })
        }
      }
      comprobarToken();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    if(password.length < 6) {
      setAlerta({
        msg: 'El Password debe ser minimo, 6 caracteres!',
        error: true
      })
      return;
    }

    try {
      const url = `/api/usuarios/olvide-password/${token}`;
      const {data} = await baseUrlAxios.post(url, {password});
      
      setAlerta({
        msg: data.msg,
        error: false
      });

      setPasswordModificado(true);
      setTokenValido(false);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  const {msg} = alerta;

  return (
    <>
    <h1 className='text-sky-600 font-black text-5xl text-center'>Reestablece tu password y ten acceso a <span className='text-slate-700'>tus proyectos</span></h1>

    {msg && <Alerta parametro={alerta} />}

    {tokenValido && (
          <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
          <div className="my-5">
            <label className='text-gray-600 block text-xl font-bold' htmlFor='password'>Nuevo Password</label>
            <input type="password" id="password" placeholder='Ingresa tu nuevo Password' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={password} onChange={e => setPassword(e.target.value)}/>
          </div>
          <input type="submit" value="Guardar Nuevo Password" className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors' />
        </form>
    )}

    {passwordModificado && (<Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'>Inicia Sesión</Link>)}

  </>
  )
}

export default NuevoPassword
