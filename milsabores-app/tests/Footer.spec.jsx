import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Footer from '../src/components/Footer';

// Mock de las imágenes SVG
vi.mock('../assets/img/instagram-logo-glyph.svg', () => ({ default: 'mock-instagram.svg' }));
vi.mock('../assets/img/logo-tiktok.svg', () => ({ default: 'mock-tiktok.svg' }));
vi.mock('../assets/img/whatsapp-glyph-black-logo.svg', () => ({ default: 'mock-whatsapp.svg' }));

describe('Componente Footer', () => {
  it('renderiza el copyright correctamente', () => {
    render(<Footer />);
    
    expect(screen.getByText(/2024 Pastelería 1000 Sabores/i)).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
  });

  it('muestra los enlaces de políticas y términos', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Políticas de Privacidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Términos y Condiciones/i)).toBeInTheDocument();
  });

  it('muestra el texto de redes sociales', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Síguenos en redes sociales/i)).toBeInTheDocument();
  });

  it('renderiza los íconos de redes sociales', () => {
    render(<Footer />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('alt', 'Instagram');
    expect(images[1]).toHaveAttribute('alt', 'TikTok');
    expect(images[2]).toHaveAttribute('alt', 'WhatsApp');
  });
});