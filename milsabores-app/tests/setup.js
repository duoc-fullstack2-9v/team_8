import '@testing-library/jest-dom'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock global para productos.js (archivo inexistente en la rama)
vi.mock("../src/data/productos.js", () => ({
  productos: [
    {
      idProd: 1,
      nombreProd: "Mock Producto",
      descProd: "Descripción",
      precioProd: 1000,
      imagenProd: "fake.png"
    }
  ]
}))

afterEach(() => {
  cleanup()
})
