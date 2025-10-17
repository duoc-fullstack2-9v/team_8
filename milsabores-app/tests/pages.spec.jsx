import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { CarritoProvider } from "../src/context/CarritoContext"

import Blog from "../src/pages/Blog"
import Carrito from "../src/pages/Carrito"
import Catalogo from "../src/pages/Catalogo"
import Contacto from "../src/pages/Contacto"
import Inicio from "../src/pages/Inicio"
import LoginPage from "../src/pages/LoginPage"
import Producto from "../src/pages/Producto"
import QuienesSomos from "../src/pages/QuienesSomos"
import RegistroUser from "../src/pages/RegistroUser"

describe("Smoke tests de Pages", () => {
  const renderWithProviders = (ui) =>
    render(
      <MemoryRouter>
        <CarritoProvider>{ui}</CarritoProvider>
      </MemoryRouter>
    )

  it("renderiza Blog sin crashear", () => {
    renderWithProviders(<Blog />)
    expect(screen.getByRole("heading", { name: /nuestro blog/i })).toBeInTheDocument()
  })

  it("renderiza Carrito sin crashear", () => {
    renderWithProviders(<Carrito />)
    expect(screen.getByRole("heading", { name: /carrito de compras/i })).toBeInTheDocument()
  })

  it("renderiza Catálogo sin crashear", () => {
    renderWithProviders(<Catalogo />)
    expect(screen.getByRole("heading", { name: /tortas cuadradas/i })).toBeInTheDocument()
  })

  it("renderiza Contacto sin crashear", () => {
    renderWithProviders(<Contacto />)
    expect(screen.getByText(/contacto/i)).toBeInTheDocument()
  })

  it("renderiza Inicio sin crashear", () => {
    renderWithProviders(<Inicio />)
    expect(screen.getByText(/inicio/i)).toBeInTheDocument()
  })

  it("renderiza LoginPage sin crashear", () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument()
  })

  it("renderiza Producto sin crashear", () => {
    renderWithProviders(<Producto />)
    expect(screen.getByText(/producto/i)).toBeInTheDocument()
  })

  it("renderiza QuienesSomos sin crashear", () => {
    renderWithProviders(<QuienesSomos />)
    expect(screen.getByRole("heading", { name: /un poco de nosotros/i })).toBeInTheDocument()
  })

  it("renderiza RegistroUser sin crashear", () => {
    renderWithProviders(<RegistroUser />)
    expect(screen.getByRole("heading", { name: /crea tu cuenta/i })).toBeInTheDocument()
  })
})
