// Verifica que o painel monta dados reais da API e envia os filtros combinados corretamente.
import React from 'react';
import { it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { api } from './api.js';
vi.mock('./api.js', () => ({ api: vi.fn() }));
afterEach(cleanup);

// Exercita busca e seletor na interface, conferindo a requisição usada para atualizar a tabela.
it('carrega produtos e combina pesquisa com categoria', async () => {
  api.mockImplementation(async path => path === '/categorias' ? [{ id: 1, nome: 'Informática' }] : [{ id: 1, nome: 'Mouse USB', preco: 25.90, quantidade: 5, Categoria: { nome: 'Informática' } }]);
  const user = userEvent.setup();
  render(<App />);
  expect(await screen.findByText('Mouse USB')).toBeTruthy();
  await user.type(screen.getByLabelText('Pesquisar por nome'), 'mouse');
  await user.click(screen.getByRole('button', { name: 'Buscar' }));
  await user.selectOptions(screen.getByLabelText('Filtrar por categoria'), '1');
  await waitFor(() => expect(api).toHaveBeenCalledWith('/produtos?busca=mouse&categoriaId=1', expect.any(Object)));
  await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  await waitFor(() => expect(screen.getByLabelText('Pesquisar por nome').value).toBe(''));
});
