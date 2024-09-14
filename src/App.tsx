import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout/Layout'
import { ErrorPage } from './pages/Error/errorPage'
import React, { Suspense } from 'react';
import Loader from './components/loader/loader';

const GeneralPage = React.lazy(() => import('./pages/GeneralPage/GeneralPage'));
const CallbackPage = React.lazy(() => import('./pages/CallbackPage/CallbackPage'));

function App() {

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<GeneralPage /> } />
          <Route path='/home' element={<GeneralPage />} />
          <Route path='/callback' element={<CallbackPage />} />
        </Route>
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
