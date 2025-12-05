import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegistroUser from '../src/pages/RegistroUser.jsx';

// 🔹 Mocks de layout
vi.mock('../src/components/Header', () => ({
  default: () => <header data-testid="mock-header">Header</header>,
}));

vi.mock('../src/components/Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

vi.mock('../src/components/Footer', () => ({
  default: () => <footer data-testid="mock-footer">Footer</footer>,
}));

// 🔹 Mock de Registro: expone un botón que usa onNavigate('login-page')
vi.mock('../src/components/Registro', () => ({
  default: ({ onNavigate }) => (
    <div data-testid="mock-registro">
      <p>Mock Registro</p>
      <button
        type="button"
        onClick={() => onNavigate && onNavigate('login-page')}
      >
        Ir a login (mock)
      </button>
    </div>
  ),
}));

// 🔹 Mock de useNavigate
let mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderRegistroUser = () => {
  return render(
    <BrowserRouter>
      <RegistroUser />
    </BrowserRouter>
  );
};

describe('Página RegistroUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();
  });

  test('renderiza Header, Navbar, Registro y Footer', () => {
    renderRegistroUser();

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-registro')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('cuando Registro llama onNavigate("login-page"), navega a /login', async () => {
    const user = userEvent.setup();
    renderRegistroUser();

    const btnIrLogin = screen.getByRole('button', {
      name: /ir a login \(mock\)/i,
    });

    await user.click(btnIrLogin);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
