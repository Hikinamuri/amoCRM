import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './pages/Layout/Layout'
import { ErrorPage } from './pages/Error/errorPage'
import { GeneralPage } from './pages/GeneralPage.tsx/GeneralPage'
import { CallbackPage } from './pages/CallbackPage/CallbackPage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/home' element={<GeneralPage />} />
        <Route path='/callback' element={<CallbackPage />} />
      </Route>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

export default App
