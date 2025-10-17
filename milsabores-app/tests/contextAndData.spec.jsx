import { renderHook, act } from "@testing-library/react"
import { CarritoProvider, useCarrito } from "../src/context/CarritoContext"
import { productos, categoriaProductos } from "../src/data/Productos"

describe("CarritoContext", () => {
  it("agrega y elimina productos correctamente", () => {
    const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>
    const { result } = renderHook(() => useCarrito(), { wrapper })

    act(() => {
      result.current.agregarCarrito({ idProd: 1, nombreProd: "Torta", precioProd: 1000 }, 2)
    })
    expect(result.current.carrito.length).toBe(1)
    expect(result.current.totalItems).toBe(2)

    act(() => {
      result.current.eliminarProducto(1)
    })
    expect(result.current.carrito.length).toBe(0)
  })

  it("actualiza cantidad y vacía carrito", () => {
    const wrapper = ({ children }) => <CarritoProvider>{children}</CarritoProvider>
    const { result } = renderHook(() => useCarrito(), { wrapper })

    act(() => {
      result.current.agregarCarrito({ idProd: 2, nombreProd: "Pie", precioProd: 500 }, 1)
    })
    act(() => {
      result.current.actualizarCantidad(2, 3)
    })
    expect(result.current.totalItems).toBe(3)

    act(() => {
      result.current.vaciarCarrito()
    })
    expect(result.current.carrito.length).toBe(0)
  })
})

describe("Productos.js", () => {
  it("exporta un array de productos con elementos", () => {
    expect(Array.isArray(productos)).toBe(true)
    expect(productos.length).toBeGreaterThan(0)
  })

  it("exporta un objeto de categorías con arrays", () => {
    expect(typeof categoriaProductos).toBe("object")
    expect(Object.keys(categoriaProductos).length).toBeGreaterThan(0)
    expect(Array.isArray(categoriaProductos["Tortas Cuadradas"])).toBe(true)
  })
})
