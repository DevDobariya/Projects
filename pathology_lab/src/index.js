import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Patients from './pages/Patients';
import AddEditForm from './pages/AddEditForm';
import OrderProduct from './pages/OrderProduct';
import Profit from './pages/Profit';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
     <Routes>
        <Route path='/' element={ <Layout /> }>
          <Route path='/' element={ < Patients /> } />
          <Route path='/newEntry' element={ < AddEditForm edit={ false } /> }  />
          <Route path='/editPatient/:id' element={ < AddEditForm edit={ true } /> } />
          <Route path='/order' element={ < OrderProduct /> } />
          <Route path='/profit' element={ < Profit /> } />
        </Route>
     </Routes>
    </BrowserRouter>
  </>
);