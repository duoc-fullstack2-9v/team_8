import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Registro from "../src/components/Registro";

describe("Registro component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renderiza el título y botones principales", () => {
    render(<Registro />);
    expect(screen.getByText(/crea tu cuenta/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /volver al login/i })).toBeInTheDocument();
  });

  it("muestra error si faltan campos obligatorios", async () => {
    render(<Registro />);
    await userEvent.click(screen.getByRole("button", { name: /registrarse/i }));
    expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
  });

  it("muestra error si el correo ya existe", async () => {
    localStorage.setItem("usuarios", JSON.stringify([{ emailUser: "test@correo.com" }]));
    render(<Registro />);
    await userEvent.type(screen.getByPlaceholderText(/nombre/i), "Mati");
    await userEvent.type(screen.getByPlaceholderText(/correo electrónico/i), "test@correo.com");
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /registrarse/i }));
    expect(screen.getByText(/ya está asociado/i)).toBeInTheDocument();
  });

  it("registra un usuario nuevo correctamente", async () => {
    const mockNavigate = vi.fn();
    window.alert = vi.fn();

    render(<Registro onNavigate={mockNavigate} />);
    await userEvent.type(screen.getByPlaceholderText(/nombre/i), "Mati");
    await userEvent.type(screen.getByPlaceholderText(/apellido/i), "Suazo");
    await userEvent.type(screen.getByPlaceholderText(/correo electrónico/i), "nuevo@correo.com");
    await userEvent.type(screen.getByPlaceholderText(/contraseña/i), "123");
    await userEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(window.alert).toHaveBeenCalledWith("¡Cuenta creada exitosamente para Mati!");
    expect(localStorage.getItem("usuarios")).toContain("nuevo@correo.com");
    expect(mockNavigate).toHaveBeenCalledWith("login");
  });

  it("navega al login al hacer click en Volver al login", async () => {
    const mockNavigate = vi.fn();
    render(<Registro onNavigate={mockNavigate} />);
    await userEvent.click(screen.getByRole("button", { name: /volver al login/i }));
    expect(mockNavigate).toHaveBeenCalledWith("login");
  });
});
