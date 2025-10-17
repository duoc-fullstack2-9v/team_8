import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect } from "vitest"
import Navbar from "../src/components/Navbar"

describe("Navbar", () => {
  it("renderiza enlaces de navegación", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument()
    expect(screen.getByText(/Quienes Somos/i)).toBeInTheDocument()
    expect(screen.getByText(/Catalogo/i)).toBeInTheDocument()
    expect(screen.getByText(/Blog/i)).toBeInTheDocument()
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument()
  })
})
