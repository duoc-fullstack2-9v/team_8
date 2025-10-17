import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { CarritoProvider } from "../src/context/CarritoContext"
import App from "../src/App"

describe("App", () => {
  it("renderiza sin crashear", () => {
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
})
