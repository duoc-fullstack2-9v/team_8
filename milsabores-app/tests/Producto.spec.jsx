import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

// Mock de useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useParams: vi.fn(),
  }
})

import { useParams } from "react-router-dom"
import { CarritoProvider } from "../src/context/CarritoContext"
import Producto from "../src/pages/Producto.jsx"

describe("Producto Page", () => {
  it("muestra un producto válido cuando el id existe", () => {
    useParams.mockReturnValue({ id: "1" })

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Producto />
        </CarritoProvider>
      </MemoryRouter>
    )

    // Ajustado al texto real que renderiza el componente
    expect(
      screen.getByText((content) => content.includes("Mock Producto"))
    ).toBeInTheDocument()
  })

  it("muestra mensaje de error cuando el producto no existe", () => {
    useParams.mockReturnValue({ id: "999" })

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Producto />
        </CarritoProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByText(/producto no encontrado/i)
    ).toBeInTheDocument()
  })
})
