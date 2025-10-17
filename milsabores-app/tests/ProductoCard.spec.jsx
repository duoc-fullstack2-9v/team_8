import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { CarritoProvider } from "../src/context/CarritoContext"
import ProductoCard from "../src/components/ProductoCard"

// Producto de prueba con las propiedades correctas
const producto = { 
  idProd: 1, 
  nombreProd: "Torta", 
  precioProd: 1000, 
  descProd: "Deliciosa torta de chocolate con relleno de crema y decoraciones" 
}

describe("ProductoCard", () => {
  it('muestra botón "Agregar al carrito" cuando cantidad = 0', () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <ProductoCard producto={producto} />
        </CarritoProvider>
      </MemoryRouter>
    )
    expect(screen.getByText(/Agregar al carrito/i)).toBeInTheDocument()
  })

  it("muestra botones + y - cuando cantidad > 0", () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <ProductoCard producto={producto} />
        </CarritoProvider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText(/Agregar al carrito/i))

    expect(screen.getByText("+")).toBeInTheDocument()
    expect(screen.getByText("-")).toBeInTheDocument()
  })

  it("incrementa y decrementa cantidad correctamente", () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <ProductoCard producto={producto} />
        </CarritoProvider>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText(/Agregar al carrito/i))
    fireEvent.click(screen.getByText("+"))
    fireEvent.click(screen.getByText("-"))

    expect(screen.getByText("+")).toBeInTheDocument()
  })
})
