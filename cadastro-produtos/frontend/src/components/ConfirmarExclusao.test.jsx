// Confirma que cancelar o diálogo de exclusão não chama a API.
import React from 'react';
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmarExclusao from './ConfirmarExclusao.jsx';
import { api } from '../api.js';
vi.mock('../api.js', () => ({ api: vi.fn() }));

// Exercita o cancelamento antes de qualquer chamada de exclusão.
it('cancelar mantém o produto', async () => {
  const cancel = vi.fn();
  render(<ConfirmarExclusao produto={{ id: 1, nome: 'Mouse' }} onCancel={cancel} onSaved={() => {}} onBusy={() => {}} />);
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(cancel).toHaveBeenCalledOnce();
  expect(api).not.toHaveBeenCalled();
});
