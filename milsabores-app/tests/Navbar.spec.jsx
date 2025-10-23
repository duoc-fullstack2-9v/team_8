import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/components/Navbar';

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
    expect(screen.getByText('Catalogo')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  test('los enlaces tienen las rutas correctas', () => {
    renderNavbar();
    
    expect(screen.getByText('Inicio').closest('a')).toHaveAttribute('href', '/inicio');
    expect(screen.getByText('Quienes Somos').closest('a')).toHaveAttribute('href', '/quienes_somos');
    expect(screen.getByText('Catalogo').closest('a')).toHaveAttribute('href', '/catalogo');
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
});