import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta';
import baseUrlAxios from '../../config/baseUrlAxios';

const Registrar = () => {
/*   const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState(''); */

  const datosUsuario = {
    nombre: "",
    email: "",
    password:"",
    repetirPassword:""
  }

  const [agregarUsuario, setAgregarUsuario] = useState(datosUsuario);
  const {nombre, email, password, repetirPassword} = agregarUsuario;

  const capturarDatosRegistro = (e) => {
    e.preventDefault();
    setAgregarUsuario({
      ...agregarUsuario,
      [e.target.name]: e.target.value, // asigna valores acada campo del formulario
    });
  };



  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault(); {/* previene que se ejecute el formulario, lo que tuviera el action y el metodo del formulario, nosotros hacemos esa parte*/}

      {/* valida que los campos del formulario no vayan vacios */}
    if([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return;
    }

    // valida de los input de contraseñas sean iguales
    if(password !== repetirPassword) {
      setAlerta({
        msg: 'Los password no son iguales',
        error: true
      })
      return;
    }

    // valida que el minimo de caracteres sea de 6, en el password
    if(password.length < 6) {
      setAlerta({
        msg: 'El password es muy corto, agrega 6 caracteres como minimo!',
        error: true
      })
      return;
    }
    /* se pone vacia la alerta para no mostrarla, al pasar todas las validaciones. */
    setAlerta({});

    //Crear el usuario en la API
    try {
      const {data} = await baseUrlAxios.post(`/api/usuarios`, {nombre, email, password});

      setAlerta({
        msg: data.msg,
        error: false
      });

      // Limpia el formulario de registro.
      setAgregarUsuario(datosUsuario);
    } catch (error) {
      //console.log(error.response.data.msg);
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }


  }

  const {msg} = alerta;

  return (
    <>
    <h1 className='text-sky-600 font-black text-5xl text-center'>Crea tu cuenta y Administra <span className='text-slate-700'>tus proyectos</span></h1>

    {msg && <Alerta parametro={alerta} />}

    <form className='my-10 bg-white shadow rounded-lg p-10'onSubmit={handleSubmit}>
    <div className="my-5">
        <label className='text-gray-600 block text-xl font-bold' htmlFor='nombre'>Nombre</label>
        <input type="text" id="nombre" placeholder='Tu Nombre ' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={nombre} name='nombre' onChange={capturarDatosRegistro}/>
      </div>
      <div className="my-5">
        <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='email'>Email</label>
        <input type="email" id="email" placeholder='Email de Registro' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={email} name='email' onChange={capturarDatosRegistro}/>
      </div>
      <div className="my-5">
        <label className='text-gray-600 block text-xl font-bold' htmlFor='password'>Password</label>
        <input type="password" id="password" placeholder='Password de Registro' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={password} name='password' onChange={capturarDatosRegistro}/>
      </div>
      <div className="my-5">
        <label className='text-gray-600 block text-xl font-bold' htmlFor='password2'>Repetir Password</label>
        <input type="password" id="password2" placeholder='Repetir tu Password' className='w-full mt-3 p-3 border rounded-xl bg-gray-50' value={repetirPassword} name='repetirPassword' onChange={capturarDatosRegistro}/>
      </div>

      <input type="submit" value="Crear Cuenta" className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors' />
    </form>

    <nav className='lg:flex lg:justify-between'>
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'> ¿Ya tienes una cuenta? Inicia Sesión?</Link>
        <Link to="/olvide-password" className='block text-center my-5 text-slate-500 uppercase text-sm'> Olvidé mi Password</Link>
    </nav>

  </>
  )
}

export default Registrar