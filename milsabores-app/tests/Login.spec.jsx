import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Login from "../src/components/Login"

describe("Login", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("muestra mensaje de error si credenciales son incorrectas", () => {
    render(<Login />)
    fireEvent.change(screen.getByPlaceholderText(/Correo/i), { target: { value: "fake@mail.com" } })
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: "1234" } })
    fireEvent.click(screen.getByText(/Ingresar/i))
    expect(screen.getByText(/Correo y\/o contraseña incorrecta/i)).toBeInTheDocument()
  })
})
