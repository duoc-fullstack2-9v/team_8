import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MensajeFlotante from '../src/components/MensajeFlotante';

// Mock del contexto
vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: vi.fn()
}));

import { useCarrito } from '../src/context/CarritoContext';

describe('Componente MensajeFlotante', () => {
  test('no renderiza nada cuando mostrarMensaje es false', () => {
    useCarrito.mockReturnValue({
      mostrarMensaje: false,
      mensajeTexto: 'Test message'
    });
    
    const { container } = render(<MensajeFlotante />);
    
    expect(container.firstChild).toBeNull();
  });

  test('renderiza el mensaje cuando mostrarMensaje es true', () => {
    useCarrito.mockReturnValue({
      mostrarMensaje: true,
      mensajeTexto: 'Producto agregado al carrito!'
    });
    
    render(<MensajeFlotante />);
    
    expect(screen.getByText('Producto agregado al carrito!')).toBeInTheDocument();
    expect(screen.getByText('Producto agregado al carrito!')).toHaveClass('mensaje-flotante-global');
  });

  test('aplica clase "mostrar" cuando está visible', () => {
    useCarrito.mockReturnValue({
      mostrarMensaje: true,
      mensajeTexto: 'Test message'
    });
    
    render(<MensajeFlotante />);
    
    const mensaje = screen.getByText('Test message');
    expect(mensaje).toHaveClass('mostrar');
  });
});