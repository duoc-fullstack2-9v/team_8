import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Registro from "../src/components/Registro"

describe("Registro", () => {
  let mockNavigate
  let mockAlert

  beforeEach(() => {
    localStorage.clear()
    mockNavigate = vi.fn()
    mockAlert = vi.fn()
    vi.stubGlobal("alert", mockAlert)
  })

  it("muestra error si faltan campos obligatorios", () => {
    render(<Registro onNavigate={mockNavigate} />)
    fireEvent.click(screen.getByText(/Registrarse/i))
    expect(screen.getByText(/Completa todos los campos/i)).toBeInTheDocument()
  })

  it("muestra error si el correo ya existe", () => {
    localStorage.setItem("usuarios", JSON.stringify([{ emailUser: "test@mail.com" }]))
    render(<Registro onNavigate={mockNavigate} />)

    fireEvent.change(screen.getByPlaceholderText(/Nombre\(s\)/i), { target: { value: "Mati" } })
    fireEvent.change(screen.getByPlaceholderText(/Correo Electrónico/i), { target: { value: "test@mail.com" } })
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "1234" } })
    fireEvent.click(screen.getByText(/Registrarse/i))

    expect(screen.getByText(/ya está asociado/i)).toBeInTheDocument()
  })

  it("registra un usuario nuevo correctamente", () => {
    render(<Registro onNavigate={mockNavigate} />)

    fireEvent.change(screen.getByPlaceholderText(/Nombre\(s\)/i), { target: { value: "Mati" } })
    fireEvent.change(screen.getByPlaceholderText(/Apellido\(s\)/i), { target: { value: "Suazo" } })
    fireEvent.change(screen.getByPlaceholderText(/Correo Electrónico/i), { target: { value: "nuevo@mail.com" } })
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "1234" } })
    fireEvent.click(screen.getByText(/Registrarse/i))

    expect(mockAlert).toHaveBeenCalledWith("¡Cuenta creada exitosamente para Mati!")
    expect(mockNavigate).toHaveBeenCalledWith("login")

    const usuarios = JSON.parse(localStorage.getItem("usuarios"))
    expect(usuarios).toHaveLength(1)
    expect(usuarios[0].emailUser).toBe("nuevo@mail.com")
  })

  it("permite volver al login con el botón correspondiente", () => {
    render(<Registro onNavigate={mockNavigate} />)
    fireEvent.click(screen.getByText(/Volver al login/i))
    expect(mockNavigate).toHaveBeenCalledWith("login-page")
  })
})
