// App.js
import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import Header from './Header'; // Importe o componente Header
import Footer from './Footer';
import RotasApp from './RotasApp';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Header />
        <RotasApp/>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
