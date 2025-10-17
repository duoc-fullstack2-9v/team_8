import { Route, Routes } from 'react-router-dom'
import Inicio from './pages/Inicio.jsx'
import Blog from './pages/Blog.jsx'
import Carrito from './pages/Carrito.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Contacto from './pages/Contacto.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Producto from './pages/Producto.jsx'
import QuienesSomos from './pages/QuienesSomos.jsx'
import RegistroUser from './pages/RegistroUser.jsx'
import MensajeFlotante from './components/MensajeFlotante.jsx'


function App() {
  return (
    <>
      <MensajeFlotante />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/quienes_somos" element={<QuienesSomos />} />
        <Route path="/registro_user" element={<RegistroUser />} />
      </Routes>
    </>  
  )
}

export default App
