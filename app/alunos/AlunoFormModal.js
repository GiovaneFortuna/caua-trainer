'use client'

import { useState, useEffect } from 'react'

const alunoVazio = {
  nome: '',
  email: '',
  telefone: '',
  data_nascimento: '',
  objetivo: '',
}

export default function AlunoFormModal({ aluno, aberto, onFechar, onSalvar }) {
  const [form, setForm] = useState(alunoVazio)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (aluno) {
      setForm({
        nome: aluno.nome || '',
        email: aluno.email || '',
        telefone: aluno.telefone || '',
        data_nascimento: aluno.data_nascimento || '',
        objetivo: aluno.objetivo || '',
      })
    } else {
      setForm(alunoVazio)
    }
  }, [aluno, aberto])

  if (!aberto) return null

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSalvando(true)
    await onSalvar(form)
    setSalvando(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-primary">
          {aluno ? 'Editar aluno' : 'Novo aluno'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              value={form.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Data de nascimento
            </label>
            <input
              type="date"
              value={form.data_nascimento}
              onChange={(e) => handleChange('data_nascimento', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Objetivo de Treino
            </label>
            <textarea
              rows={3}
              value={form.objetivo}
              onChange={(e) => handleChange('objetivo', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
