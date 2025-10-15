import { Route, Routes } from 'react-router-dom'
import Inicio from './pages/Inicio.jsx'
import Blog from './pages/Blog.jsx'
import Carrito from './pages/Carrito.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Contacto from './pages/Contacto.jsx'
import Login from './pages/Login-page.jsx'
import QuienesSomos from './pages/QuienesSomos.jsx'
import RegistroUser from './pages/RegistroUser.jsx'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quienes_somos" element={<QuienesSomos />} />
      <Route path="/registro_user" element={<RegistroUser />} />
    </Routes>
  )
}

export default App
