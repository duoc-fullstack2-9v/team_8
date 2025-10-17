import { vi } from 'vitest'
import React from 'react'
import ReactDOM from 'react-dom/client'

// Mock de App para no renderizar todo
vi.mock('../src/App.jsx', () => ({
  default: () => <div>Mocked App</div>
}));

describe('main.jsx', () => {
  test('renderiza App dentro de root', async () => {
    // Crear el contenedor root en el DOM de prueba
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Espiamos ReactDOM.createRoot
    const createRootSpy = vi.spyOn(ReactDOM, 'createRoot');
    const renderSpy = vi.fn();
    createRootSpy.mockReturnValue({ render: renderSpy });

    // Import dinámico (transpila JSX)
    await import('../src/main.jsx');

    expect(createRootSpy).toHaveBeenCalledWith(root);
    expect(renderSpy).toHaveBeenCalled();
  });
});
