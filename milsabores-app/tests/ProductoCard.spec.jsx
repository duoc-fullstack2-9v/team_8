import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ProductoCard from "../src/components/ProductoCard"

const mockNavigate = vi.fn()
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate
}))

const mockAgregarCarrito = vi.fn()
const mockMostrarMensajeTemporal = vi.fn()
vi.mock("../src/context/CarritoContext", () => ({
  useCarrito: () => ({
    agregarCarrito: mockAgregarCarrito,
    mostrarMensajeTemporal: mockMostrarMensajeTemporal
  })
}))

const producto = {
  idProd: 1,
  nombreProd: "Torta de Chocolate",
  descProd: "Deliciosa torta",
  precioProd: 10000,
  imagenProd: "fake.png"
}

describe("ProductoCard", () => {
  it("renderiza nombre y precio", () => {
    render(<ProductoCard producto={producto} />)
    expect(screen.getByText(/Torta de Chocolate/i)).toBeInTheDocument()

    // ✅ Matcher robusto: valida que aparezca el número y la moneda, sin importar formato exacto
    expect(
      screen.getByText((content) => content.includes("10.000") && content.includes("CLP"))
    ).toBeInTheDocument()
  })

  it("aumenta y disminuye cantidad", () => {
    render(<ProductoCard producto={producto} />)
    fireEvent.click(screen.getByLabelText(/Aumentar cantidad/i))
    expect(screen.getByText("1")).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText(/Disminuir cantidad/i))
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("llama a mostrarMensajeTemporal si cantidad es 0", () => {
    render(<ProductoCard producto={producto} />)
    fireEvent.click(screen.getByText(/Agregar al Carrito/i))
    expect(mockMostrarMensajeTemporal).toHaveBeenCalledWith("⚠️ Selecciona al menos 1 unidad")
  })
})
