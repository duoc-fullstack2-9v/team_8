import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuienesSomos from '../src/pages/QuienesSomos';

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

const renderQuienesSomos = () => {
  return render(
    <BrowserRouter>
      <QuienesSomos />
    </BrowserRouter>
  );
};

describe('Página QuienesSomos', () => {
  test('renderiza todos los componentes principales', () => {
    renderQuienesSomos();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
  });

  test('muestra el hero banner con título y subtítulo correctos', () => {
    renderQuienesSomos();
    
    expect(screen.getByText('Un poco de nosotros...')).toBeInTheDocument();
    expect(screen.getByText(/Conoce la dulce historia/)).toBeInTheDocument();
  });

  test('muestra la sección de historia', () => {
    renderQuienesSomos();
    
    expect(screen.getByText('Nuestra Historia ⏳')).toBeInTheDocument();
    expect(screen.getByText(/Pastelería Mil Sabores/)).toBeInTheDocument();
    expect(screen.getByText(/El Momento que Nos Puso en el Libro de los Récords/)).toBeInTheDocument();
    expect(screen.getByText(/50 Años Endulzando Momentos/)).toBeInTheDocument();
  });

  test('muestra la sección de misión y visión', () => {
    renderQuienesSomos();
    
    expect(screen.getByText('Nuestra misión')).toBeInTheDocument();
    expect(screen.getByText('Nuestra visión')).toBeInTheDocument();
    expect(screen.getByText(/Ofrecer una experiencia dulce/)).toBeInTheDocument();
    expect(screen.getByText(/Convertirnos en la tienda online líder/)).toBeInTheDocument();
  });
});