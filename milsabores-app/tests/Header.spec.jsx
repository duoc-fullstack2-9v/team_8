import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MemoryRouter } from "react-router-dom"
import Header from "../src/components/Header"

// Mock del contexto
vi.mock("../src/context/CarritoContext", () => ({
  useCarrito: () => ({ totalItems: 3, carrito: [] })
}))

describe("Header", () => {
  it("renderiza logo, título y enlaces", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    expect(screen.getByAltText(/Logo Pasteleria Mil Sabores/i)).toBeInTheDocument()
    expect(screen.getByText(/Pastelería Mil Sabores/i)).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument() // totalItems mockeado
  })
})
