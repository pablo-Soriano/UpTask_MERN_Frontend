import {useState, useEffect, createContext} from 'react';
import {useNavigate}  from 'react-router-dom';
import baseUrlAxios from '../config/baseUrlAxios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        autenticarUsuario();
    }, [])

    // valida si hay un token en localStorage
    const autenticarUsuario = async () => {
        const token = localStorage.getItem('token');
        if(!token) {
            setCargando(false);
            return
        }

        // se configura el Bearer para validacion
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        
        try {
            const {data} = await baseUrlAxios.get('/api/usuarios/perfil', config);
            setAuth(data);
            // se redirecciona a la vista proyectos.
            //navigate('/proyectos'); //se comentarea porque al estar en la pagina de un proyecto y al actualizar lo vuelve a enviar a listar todos los proyectos
        } catch (error) {
            setAuth({});
        } 

        setCargando(false);
    }

    const cerrarSesionAuth = () => {
        setAuth({});
    }



    // toda funcion creada debe estar en return, para que este disponible en los demas componentes, para poder acceder a estas funciones.
    return(
        <AuthContext.Provider 
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>

    )
}


export default AuthContext;