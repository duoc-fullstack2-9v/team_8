import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MensajeFlotante from "../src/components/MensajeFlotante"

vi.mock("../src/context/CarritoContext", () => ({
  useCarrito: () => ({ mostrarMensaje: true, mensajeTexto: "Producto agregado" })
}))

describe("MensajeFlotante", () => {
  it("muestra mensaje cuando mostrarMensaje es true", () => {
    render(<MensajeFlotante />)
    expect(screen.getByText(/Producto agregado/i)).toBeInTheDocument()
  })
})
