import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import FormularioContacto from "../src/components/FormContacto"

describe("FormularioContacto", () => {
  it("renderiza inputs y botón", () => {
    render(<FormularioContacto />)
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Enviar/i })).toBeInTheDocument()
  })

  it("muestra mensaje de éxito al enviar", () => {
    render(<FormularioContacto />)
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: "Mati" } })
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: "test@mail.com" } })
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: "Hola!" } })
    fireEvent.click(screen.getByRole("button", { name: /Enviar/i }))
    expect(screen.getByText(/¡Gracias por contactarnos!/i)).toBeInTheDocument()
  })
})
