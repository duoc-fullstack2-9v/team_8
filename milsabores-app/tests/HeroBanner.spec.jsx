import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HeroBanner from '../src/components/HeroBanner';

describe('Componente HeroBanner', () => {
  test('renderiza título y subtítulo correctamente', () => {
    render(<HeroBanner titulo="Mi Título" subtitulo="Mi Subtítulo" />);
    
    expect(screen.getByText('Mi Título')).toBeInTheDocument();
    expect(screen.getByText('Mi Subtítulo')).toBeInTheDocument();
  });

  test('renderiza con props vacías', () => {
    const { container } = render(<HeroBanner titulo="" subtitulo="" />);
    
    // Verifica que los elementos existen pero están vacíos
    const h2 = container.querySelector('h2');
    const p = container.querySelector('p');
    
    expect(h2).toBeInTheDocument();
    expect(h2.textContent).toBe('');
    expect(p).toBeInTheDocument();
    expect(p.textContent).toBe('');
  });

  test('mantiene la estructura HTML correcta', () => {
    const { container } = render(
      <HeroBanner titulo="Título Test" subtitulo="Subtítulo Test" />
    );
    
    const section = container.querySelector('section.hero');
    expect(section).toBeInTheDocument();
    expect(section).toContainElement(screen.getByText('Título Test'));
    expect(section).toContainElement(screen.getByText('Subtítulo Test'));
  });
});