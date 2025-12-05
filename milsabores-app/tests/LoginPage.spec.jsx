import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import userEvent from '@testing-library/user-event';

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

vi.mock('../src/components/Login', () => ({
  default: ({ onNavigate }) => (
    <div data-testid="mock-login">
      <button onClick={() => onNavigate('registro')}>Registro</button>
    </div>
  )
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('Página LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza todos los componentes principales', () => {
    renderLoginPage();
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-login')).toBeInTheDocument();
  });

  test('cuando Login llama onNavigate("registro"), navega a /registro_user', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const btnIrRegistro = screen.getByRole('button', {
      name: /registro/i,
    });

    await user.click(btnIrRegistro);

    expect(mockNavigate).toHaveBeenCalledWith('/registro_user');
  });

});