import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../src/components/Header';

// Mock del CarritoContext
vi.mock('../src/context/CarritoContext', () => ({
  useCarrito: vi.fn(),
}));

import { useCarrito } from '../src/context/CarritoContext';

const renderHeader = (totalItems = 3) => {
  useCarrito.mockReturnValue({
    carrito: totalItems > 0 ? Array(totalItems).fill({}) : [],
    totalItems
  });
  
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Componente Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el logo de la pastelería', () => {
    renderHeader();
    
    const logo = screen.getByAltText('Logo Pasteleria Mil Sabores');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  test('muestra el título y subtítulo de la pastelería', () => {
    renderHeader();
    
    expect(screen.getByText('Pastelería Mil Sabores')).toBeInTheDocument();
    expect(screen.getByText('50 años endulzando tus recuerdos')).toBeInTheDocument();
  });

    test('el título de la pastelería navega al inicio', async () => {
    const user = userEvent.setup();
    renderHeader();

    const titleLink = screen.getByText('Pastelería Mil Sabores').closest('a');

    expect(titleLink).toHaveAttribute('href', '/');
    await user.click(titleLink);
  });

  test('muestra el contador del carrito', () => {
    renderHeader(5);
    
    // Buscar por ID en lugar de data-testid
    const contador = screen.getByText('5');
    expect(contador).toBeInTheDocument();
    expect(contador).toHaveAttribute('id', 'cart-count');
  });

  test('renderiza los íconos de carrito y usuario', () => {
    renderHeader();
    
    const cartIcon = screen.getByAltText('Logo carrito');
    const userIcon = screen.getByAltText('Logo Usuario');
    
    expect(cartIcon).toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  test('navega al inicio cuando se hace clic en el logo', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const logoLink = screen.getByAltText('Logo Pasteleria Mil Sabores').closest('a');
    
    // Verificar que el enlace tiene el href correcto
    expect(logoLink).toHaveAttribute('href', '/');
    
    await user.click(logoLink);
  });

  test('navega al carrito cuando se hace clic en el ícono del carrito', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const cartLink = screen.getByAltText('Logo carrito').closest('a');
    
    // Verificar que el enlace tiene el href correcto
    expect(cartLink).toHaveAttribute('href', '/carrito');
    
    await user.click(cartLink);
  });

  test('navega al login cuando se hace clic en el ícono de usuario', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const userLink = screen.getByAltText('Logo Usuario').closest('a');
    
    // Verificar que el enlace tiene el href correcto
    expect(userLink).toHaveAttribute('href', '/login');
    
    await user.click(userLink);
  });

  test('muestra el contador de items en el carrito', () => {
    renderHeader(5);
    
    const contador = screen.getByText('5');
    expect(contador).toBeInTheDocument();
  });

  test('muestra 0 cuando el carrito está vacío', () => {
    renderHeader(0);
    
    const contador = screen.getByText('0');
    expect(contador).toBeInTheDocument();
  });
});