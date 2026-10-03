// Verifica feedback de validação e gravação do formulário antes de sua implementação.
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProdutoForm from './ProdutoForm.jsx';
import { api } from '../api.js';
vi.mock('../api.js', () => ({ api: vi.fn() }));
afterEach(cleanup);

// Confirma que falha do servidor preserva o formulário e uma nova tentativa conclui a gravação.
describe('ProdutoForm', () => {
  it('exibe erro do servidor e permite corrigir e salvar', async () => {
    const user = userEvent.setup();
    const salvo = vi.fn();
    api.mockRejectedValueOnce(Object.assign(new Error('Confira os dados informados.'), { campos: { nome: 'Informe um nome válido.' } }));
    api.mockResolvedValueOnce({ id: 1 });
    render(<ProdutoForm categorias={[{ id: 1, nome: 'Informática' }]} produto={{ nome: 'Mouse', preco: '20', quantidade: '1', categoriaId: 1 }} onSaved={salvo} onCancel={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    expect(await screen.findByText('Informe um nome válido.')).toBeTruthy();
    expect(screen.getByLabelText('Nome do produto').value).toBe('Mouse');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    expect(salvo).toHaveBeenCalled();
  });
});
