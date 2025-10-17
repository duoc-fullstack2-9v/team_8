import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import HeroBanner from "../src/components/HeroBanner"

describe("HeroBanner", () => {
  it("renderiza título y subtítulo", () => {
    render(<HeroBanner titulo="Bienvenido" subtitulo="Disfruta nuestros sabores" />)
    expect(screen.getByText("Bienvenido")).toBeInTheDocument()
    expect(screen.getByText("Disfruta nuestros sabores")).toBeInTheDocument()
  })
})
