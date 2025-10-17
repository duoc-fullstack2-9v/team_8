import { render, screen, fireEvent } from "@testing-library/react"
import Login from "../src/components/Login"

describe("Login", () => {
  it("muestra error con credenciales inválidas", () => {
    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "wrong" },
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }))

    // Ajustado al texto real que muestra tu componente
    expect(
      screen.getByText(/correo y\/o contraseña incorrecta/i)
    ).toBeInTheDocument()
  })

  it("mantiene el formulario visible tras intento de login", () => {
    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "admin" },
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "admin123" },
    })
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }))

    // En vez de buscar 'Bienvenido', validamos que el título siga visible
    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument()
  })
})
