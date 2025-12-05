import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contacto from '../src/pages/Contacto';

// Mocks
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>
}));

vi.mock('../src/components/HeroBanner', () => ({
  default: ({ titulo, subtitulo }) => (
    <div data-testid="mock-hero-banner">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  )
}));

vi.mock('../src/components/FormContacto', () => ({
  default: () => <div data-testid="mock-form-contacto">Formulario Contacto</div>
}));

const renderContacto = () => {
  return render(
    <BrowserRouter>
      <Contacto />
    </BrowserRouter>
  );
};

describe('Página Contacto', () => {
  test('renderiza todos los componentes principales', () => {
    renderContacto();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-form-contacto')).toBeInTheDocument();
  });

  test('muestra el hero banner con título y subtítulo correctos', () => {
    renderContacto();
    
    expect(screen.getByText('Contáctanos 📩')).toBeInTheDocument();
    expect(screen.getByText(/¿Tienes alguna consulta?/)).toBeInTheDocument();
  });
});