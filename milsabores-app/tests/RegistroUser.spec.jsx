import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RegistroUser from '../src/pages/RegistroUser';

// Mock de componentes hijos
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Registro', () => ({
  default: () => <div data-testid="mock-registro">Componente Registro</div>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

describe('Página RegistroUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRegistroUser = () => {
    return render(
      <BrowserRouter>
        <RegistroUser />
      </BrowserRouter>
    );
  };

  it('renderiza todos los componentes principales', () => {
    renderRegistroUser();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-registro')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('renderiza el componente de registro', () => {
    renderRegistroUser();

    expect(screen.getByTestId('mock-registro')).toBeInTheDocument();
  });
});