import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import userEvent from '@testing-library/user-event';

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Componente Navbar', () => {
  test('renderiza todos los enlaces de navegación', () => {
    renderNavbar();
    
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Quienes Somos')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  test('los enlaces tienen las rutas correctas', () => {
    renderNavbar();
    
    expect(screen.getByText('Inicio').closest('a')).toHaveAttribute('href', '/inicio');
    expect(screen.getByText('Quienes Somos').closest('a')).toHaveAttribute('href', '/quienes_somos');
    expect(screen.getByText('Catálogo').closest('a')).toHaveAttribute('href', '/catalogo');
    expect(screen.getByText('Blog').closest('a')).toHaveAttribute('href', '/blog');
    expect(screen.getByText('Contacto').closest('a')).toHaveAttribute('href', '/contacto');
  });

  test('tiene la estructura de navegación correcta', () => {
    const { container } = renderNavbar();
    
    const nav = container.querySelector('nav.navbar');
    expect(nav).toBeInTheDocument();
    
    const ul = container.querySelector('ul.nav-links');
    expect(ul).toBeInTheDocument();
    expect(ul.children).toHaveLength(5);
  });
  
  test('abre y cierra el menú hamburguesa al hacer clic', async () => {
    const user = userEvent.setup();
    const { container } = renderNavbar();

    // selecciona el botón hamburguesa
    const hamburger = container.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();

    // antes de hacer click, el menú NO debe estar abierto
    const menu = container.querySelector('.nav-links');
    expect(menu.classList.contains('open')).toBe(false);

    // clic para abrir
    await user.click(hamburger);
    expect(menu.classList.contains('open')).toBe(true);

    // clic para cerrar
    await user.click(hamburger);
    expect(menu.classList.contains('open')).toBe(false);
  });
});