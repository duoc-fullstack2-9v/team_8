import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

// Variables dinámicas para simular el estado del contexto
let mockCarrito = []
let mockTotal = 0

// Mock del contexto de Carrito
vi.mock("../src/context/CarritoContext", () => {
  return {
    useCarrito: () => ({
      carrito: mockCarrito,
      agregarCarrito: vi.fn(),
      vaciarCarrito: vi.fn(),
      totalPagar: mockTotal,
    }),
    CarritoProvider: ({ children }) => <div>{children}</div>,
  }
})

import Carrito from "../src/pages/Carrito.jsx"
import { CarritoProvider } from "../src/context/CarritoContext"

describe("Carrito Page", () => {
  beforeEach(() => {
    // Reiniciamos el mock antes de cada test
    mockCarrito = []
    mockTotal = 0
  })

  it("muestra mensaje vacío cuando no hay productos", () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Carrito />
        </CarritoProvider>
      </MemoryRouter>
    )
    expect(
      screen.getByText(/no hay productos en el carrito/i)
    ).toBeInTheDocument()
  })

  it("muestra productos cuando el contexto tiene items", () => {
    // Simulamos un carrito con un producto válido
    mockCarrito = [
      { id: 1, nombreProd: "Torta de Chocolate", cantidad: 1, precio: 5000 },
    ]
    mockTotal = 5000

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Carrito />
        </CarritoProvider>
      </MemoryRouter>
    )

    // Verificamos que aparece el producto
    expect(screen.getByText(/torta de chocolate/i)).toBeInTheDocument()

    // Verificamos que aparece el TOTAL (matcher más específico para evitar conflicto con SubTotal)
    expect(
      screen.getByText((content) => content.includes("TOTAL:"))
    ).toBeInTheDocument()
  })

  it("vuelve a mostrar el mensaje vacío al vaciar el carrito", () => {
    // Simulamos carrito vacío
    mockCarrito = []
    mockTotal = 0

    render(
      <MemoryRouter>
        <CarritoProvider>
          <Carrito />
        </CarritoProvider>
      </MemoryRouter>
    )

    expect(
      screen.getByText(/no hay productos en el carrito/i)
    ).toBeInTheDocument()
  })
})
