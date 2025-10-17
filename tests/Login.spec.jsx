import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Login from "../src/components/Login";

describe("Login component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renderiza el título y botones principales", () => {
    render(<Login />);
    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it("muestra mensaje si viene de registro exitoso", () => {
    delete window.location;
    window.location = new URL("http://localhost?registro=ok");
    render(<Login />);
    expect(screen.getByText(/ahora puedes iniciar sesión/i)).toBeInTheDocument();
  });

  it("muestra error si las credenciales son incorrectas", async () => {
    render(<Login />);
    await userEvent.type(screen.getByPlaceholderText(/correo electrónico/i), "wrong@correo.com");
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), "badpass");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(screen.getByText(/correo y\/o contraseña incorrecta/i)).toBeInTheDocument();
  });

  it("inicia sesión correctamente con usuario válido", async () => {
    localStorage.setItem("usuarios", JSON.stringify([
      { emailUser: "test@correo.com", password: "123", nomUser: "Mati" }
    ]));
    const mockNavigate = vi.fn();
    window.alert = vi.fn();

    render(<Login onNavigate={mockNavigate} />);
    await userEvent.type(screen.getByPlaceholderText(/correo electrónico/i), "test@correo.com");
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(window.alert).toHaveBeenCalledWith("¡Bienvenido Mati!");
    expect(localStorage.getItem("sesionActiva")).toBe("test@correo.com");
    expect(mockNavigate).toHaveBeenCalledWith("home");
  });

  it("navega al registro al hacer click en Crear cuenta", async () => {
    const mockNavigate = vi.fn();
    render(<Login onNavigate={mockNavigate} />);
    await userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));
    expect(mockNavigate).toHaveBeenCalledWith("registro");
  });
});
