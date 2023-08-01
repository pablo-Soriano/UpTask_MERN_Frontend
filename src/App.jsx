import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouterApp from "./routes/RouterApp";
import {AuthProvider} from './context/AuthProvider'
import { ProyectosProvider } from "./context/ProyectosProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>
          <RouterApp />
         </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
