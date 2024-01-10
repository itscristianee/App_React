// FrontOfficeRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './componentes/Home';
import Sobre from './componentes/Sobre';
import Cliente from './componentes/Clientes';
import Marcar from './componentes/Marcacao';
import Prestacao from './componentes/Prestacao';

function Rotas() {
  return (
    <Routes>
          <Route path="/" element={<Home />} /> {/* Renderiza o Outlet */}
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/clientes" element={<Cliente />} />
            <Route path="/marcar" element={<Marcar />} />
            <Route path="/prestacao" element={<Prestacao />} />
          {/* Adicione outras rotas, se necessário */}
        </Routes>
   
  );
}

export default Rotas;
