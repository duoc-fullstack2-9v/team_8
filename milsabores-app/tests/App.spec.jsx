import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import App from '../src/App.jsx'

beforeAll(() => {
  window.history.pushState = vi.fn();
});

describe('App component', () => {
  test('renderiza la página Home por defecto', () => {
    render(<App />);
    // Verifica que se rendericen los títulos y subtítulos de Home
    expect(screen.getAllByText(/Pastelería Mil Sabores/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/50 años endulzando tus recuerdos/i).length).toBeGreaterThan(0);
  });

  test('navega a Login al hacer click en botón de Home', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Iniciar Sesión/i));
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  test('navega a Registro al hacer click en botón de Home', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Crear Cuenta/i));
    expect(screen.getByRole('button', { name: /Volver al login/i })).toBeInTheDocument();
  });

  test('los botones del header permiten volver a Home', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '🔐 Login' }));
    fireEvent.click(screen.getByRole('button', { name: '🏠 Inicio' }));
    expect(screen.getAllByText(/Pastelería Mil Sabores/i).length).toBeGreaterThan(0);
  });

  // Cobertura de useEffect y navigateTo
  test('detecta la ruta /login al cargar la app', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login' },
      writable: true,
    });
    render(<App />);
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  test('detecta la ruta /registro al cargar la app', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/registro' },
      writable: true,
    });
    render(<App />);
    expect(await screen.findByRole('button', { name: /Volver al login/i }))
      .toBeInTheDocument();
  });

  test('detecta la ruta /login.html al cargar la app', () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login.html' },
      writable: true,
    });
    render(<App />);
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  test('detecta la ruta /registro.html al cargar la app', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/registro.html' },
      writable: true,
    });
    render(<App />);
    expect(await screen.findByRole('button', { name: /Volver al login/i }))
      .toBeInTheDocument();
  });

  // Cobertura explícita de todos los botones del header
  test('el botón Inicio del header navega a Home', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '🏠 Inicio' }));
    expect(screen.getAllByText(/Pastelería Mil Sabores/i).length).toBeGreaterThan(0);
  });

  test('el botón Login del header navega a Login', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '🔐 Login' }));
    expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument();
  });

  test('el botón Registro del header navega a Registro', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '📝 Registro' }));
    expect(screen.getByRole('button', { name: /Volver al login/i })).toBeInTheDocument();
  });
});
