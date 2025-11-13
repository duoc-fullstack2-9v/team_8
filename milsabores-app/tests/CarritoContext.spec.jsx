import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { CarritoProvider, useCarrito } from '../src/context/CarritoContext';

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { 
    carrito, 
    agregarCarrito, 
    eliminarProducto, 
    actualizarCantidad, 
    vaciarCarrito,
    totalItems,
    totalPagar 
  } = useCarrito();

  return (
    <div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="total-pagar">{totalPagar}</div>
      <div data-testid="carrito-length">{carrito.length}</div>
      
      <button 
        onClick={() => agregarCarrito(
          { idProd: 1, nombreProd: 'Torta Test', precioProd: 10000 }, 
          2
        )}
      >
        Agregar Producto
      </button>
      
      <button 
        onClick={() => eliminarProducto(1)}
      >
        Eliminar Producto
      </button>
      
      <button 
        onClick={() => actualizarCantidad(1, 5)}
      >
        Actualizar Cantidad
      </button>
      
      <button onClick={vaciarCarrito}>
        Vaciar Carrito
      </button>

      {carrito.map(item => (
        <div key={item.idProd} data-testid={`producto-${item.idProd}`}>
          {item.nombreProd} - Cantidad: {item.cantidad}
        </div>
      ))}
    </div>
  );
};

describe('CarritoContext', () => {
  // Mock de localStorage
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    mockLocalStorage.getItem.mockReturnValue(null); // Carrito vacío inicialmente
  });

  const renderWithProvider = () => {
    return render(
      <CarritoProvider>
        <TestComponent />
      </CarritoProvider>
    );
  };

  it('proporciona el contexto correctamente', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-pagar')).toHaveTextContent('0');
    expect(screen.getByTestId('carrito-length')).toHaveTextContent('0');
  });

  it('agrega productos al carrito correctamente', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    const agregarBtn = screen.getByText('Agregar Producto');
    await user.click(agregarBtn);

    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-pagar')).toHaveTextContent('20000');
    expect(screen.getByTestId('carrito-length')).toHaveTextContent('1');
    expect(screen.getByTestId('producto-1')).toHaveTextContent('Torta Test - Cantidad: 2');
  });

  it('elimina productos del carrito correctamente', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    // Primero agregar un producto
    await user.click(screen.getByText('Agregar Producto'));
    
    // Luego eliminarlo
    await user.click(screen.getByText('Eliminar Producto'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-pagar')).toHaveTextContent('0');
    expect(screen.getByTestId('carrito-length')).toHaveTextContent('0');
  });

  it('actualiza la cantidad de productos correctamente', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    // Agregar producto
    await user.click(screen.getByText('Agregar Producto'));
    
    // Actualizar cantidad
    await user.click(screen.getByText('Actualizar Cantidad'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('5');
    expect(screen.getByTestId('total-pagar')).toHaveTextContent('50000');
    expect(screen.getByTestId('producto-1')).toHaveTextContent('Torta Test - Cantidad: 5');
  });

  it('vacía el carrito completamente', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    
    // Agregar productos
    await user.click(screen.getByText('Agregar Producto'));
    
    // Vaciar carrito
    await user.click(screen.getByText('Vaciar Carrito'));

    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-pagar')).toHaveTextContent('0');
    expect(screen.getByTestId('carrito-length')).toHaveTextContent('0');
  });

  it('carga el carrito desde localStorage al inicializar', () => {
    const carritoGuardado = JSON.stringify([
      { idProd: 1, nombreProd: 'Producto Guardado', precioProd: 15000, cantidad: 3 }
    ]);
    
    mockLocalStorage.getItem.mockReturnValue(carritoGuardado);
    
    renderWithProvider();

    expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    expect(screen.getByTestId('total-pagar')).toHaveTextContent('45000');
    expect(screen.getByTestId('producto-1')).toHaveTextContent('Producto Guardado - Cantidad: 3');
  });
});