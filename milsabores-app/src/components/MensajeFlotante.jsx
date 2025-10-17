import { useCarrito } from '../context/CarritoContext';

function MensajeFlotante() {
  const { mostrarMensaje, mensajeTexto } = useCarrito();

  if (!mostrarMensaje) return null;

  return (
    <div className="mensaje-flotante-global mostrar">
      {mensajeTexto}
    </div>
  );
}

export default MensajeFlotante;