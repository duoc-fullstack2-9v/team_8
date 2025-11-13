import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from '../src/context/CarritoContext.jsx';
import Blog from '../src/pages/Blog.jsx';

// Mocks
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>
}));

vi.mock('../src/components/HeroBanner', () => ({
  default: ({ titulo, subtitulo }) => (
    <div data-testid="mock-hero-banner">
      <h1>{titulo}</h1>
      <p>{subtitulo}</p>
    </div>
  )
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>
}));

// Mock de imágenes
vi.mock('/../src/assets/img/torta-vegana-de-chocolate.jpg', () => 'mock-torta-vegana.jpg');
vi.mock('/../src/assets/img/equipo-mil-sabores.png', () => 'mock-equipo.png');

const renderBlog = () => {
  return render(
    <BrowserRouter>
      <CarritoProvider>
        <Blog />
      </CarritoProvider>  
    </BrowserRouter>
  );
};

describe('Página Blog', () => {
  test('renderiza todos los componentes principales', () => {
    renderBlog();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-banner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('muestra el hero banner del blog', () => {
    renderBlog();
    
    expect(screen.getByText('Nuestro Blog')).toBeInTheDocument();
    expect(screen.getByText('Novedades, recetas y más desde Mil Sabores')).toBeInTheDocument();
  });

  test('muestra las entradas del blog', () => {
    renderBlog();
    
    expect(screen.getByText('Receta de la Semana: Torta Casera de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Pastelería Mil Sabores obtuvo el 3er Lugar en la Competencia Regional de Pastelería Tradicional')).toBeInTheDocument();
  });

  test('muestra las descripciones de las entradas', () => {
    renderBlog();
    
    expect(screen.getByText(/Con pocos ingredientes y mucho sabor/)).toBeInTheDocument();
    expect(screen.getByText(/Porque no solo se trata de ganar/)).toBeInTheDocument();
  });

  test('muestra botones "Leer más" para cada entrada', () => {
    renderBlog();
    
    const botonesLeerMas = screen.getAllByRole('button', { name: 'Leer más' });
    expect(botonesLeerMas).toHaveLength(2);
  });

  test('renderiza las imágenes del blog', () => {
    renderBlog();
    
    const imagenes = screen.getAllByRole('img');
    // Las imágenes de las entradas + posibles imágenes de otros componentes
    expect(imagenes.length).toBeGreaterThanOrEqual(2);
  });
});