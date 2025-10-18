import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { CarritoProvider } from "../src/context/CarritoContext"
import App from "../src/App"

describe("main.jsx (smoke tests)", () => {
  it("renderiza App dentro de CarritoProvider sin crashear", () => {
    render(
      <CarritoProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </CarritoProvider>
    )
    // Validamos el heading principal <h1>
    expect(
      screen.getByRole("heading", { level: 1, name: /Pastelería Mil Sabores/i })
    ).toBeInTheDocument()
  })

  it("renderiza el hero de la página de inicio", () => {
    render(
      <CarritoProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </CarritoProvider>
    )
    expect(
      screen.getByText(/50 años endulzando tus recuerdos/i)
    ).toBeInTheDocument()
  })

  it("renderiza el footer correctamente", () => {
    render(
      <CarritoProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </CarritoProvider>
    )
    expect(
      screen.getByText(/© 2024 Pastelería 1000 Sabores/i)
    ).toBeInTheDocument()
  })
})
