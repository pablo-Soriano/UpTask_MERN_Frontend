import React from "react";
import { Route, Routes } from "react-router-dom";
import RouteAuth from "../Auth/RoutesAuth/RouteAuth";
import RouteProyecto from "../Proyectos/RoutesProyecto/RouteProyecto";

const RouterApp = () => {
  return (
    <Routes>
      <Route path="/*" element={<RouteAuth/>}/>
      <Route path="/proyectos/*" element={<RouteProyecto/>}/>

    </Routes>
  );
};

export default RouterApp;
