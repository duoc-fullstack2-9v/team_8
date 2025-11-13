// tests/FormContacto.spec.jsx
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioContacto from '../src/components/FormContacto';

describe('Componente FormContacto', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // por si quedó algo stubeado en otros tests
  });

  test(
    'envía el formulario y muestra/oculta el mensaje de éxito',
    async () => {
      const user = userEvent.setup({ delay: null }); // timers reales

      render(<FormularioContacto />);

      // Completa TODOS los campos requeridos
      await user.type(screen.getByLabelText(/nombre:?/i), 'Álvaro');
      await user.type(screen.getByLabelText(/correo.*electrónico:?/i), 'alvaro@example.com');
      await user.type(screen.getByLabelText(/mensaje:?/i), 'Consulta de prueba');

      await user.click(screen.getByRole('button', { name: /enviar/i }));

      // Aparece de inmediato
      expect(screen.getByText(/gracias por contactarnos/i)).toBeInTheDocument();

      // Se oculta ~5s después -> esperamos su desaparición
      await waitForElementToBeRemoved(
        () => screen.queryByText(/gracias por contactarnos/i),
        { timeout: 6000 } // 5s + margen
      );
    },
    8000 // margen total del test
  );
});
