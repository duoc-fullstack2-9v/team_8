import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Footer from "../src/components/Footer"

describe("Footer", () => {
  it("renderiza el texto de copyright", () => {
    render(<Footer />)
    expect(screen.getByText(/2024 Pastelería 1000 Sabores/i)).toBeInTheDocument()
  })

  it("muestra enlaces de políticas y términos", () => {
    render(<Footer />)
    expect(screen.getByText(/Políticas de Privacidad/i)).toBeInTheDocument()
    expect(screen.getByText(/Términos y Condiciones/i)).toBeInTheDocument()
  })

  it("muestra íconos de redes sociales", () => {
    render(<Footer />)
    expect(screen.getByAltText("Instagram")).toBeInTheDocument()
    expect(screen.getByAltText("TikTok")).toBeInTheDocument()
    expect(screen.getByAltText("WhatsApp")).toBeInTheDocument()
  })
})
