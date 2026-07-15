'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import AlunoFormModal from './AlunoFormModal'

export default function AlunosPage() {
  const supabase = createClient()

  const [alunos, setAlunos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null)
  const [erro, setErro] = useState('')

  async function carregarAlunos() {
    setCarregando(true)
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      setErro('Erro ao carregar alunos.')
    } else {
      setAlunos(data)
    }
    setCarregando(false)
  }

  useEffect(() => {
    carregarAlunos()
  }, [])

  function abrirNovo() {
    setAlunoEmEdicao(null)
    setModalAberto(true)
  }

  function abrirEdicao(aluno) {
    setAlunoEmEdicao(aluno)
    setModalAberto(true)
  }

  async function salvarAluno(form) {
    setErro('')

    if (alunoEmEdicao) {
      const { error } = await supabase
        .from('alunos')
        .update(form)
        .eq('id', alunoEmEdicao.id)

      if (error) {
        setErro('Erro ao atualizar aluno.')
        return
      }
    } else {
      const resposta = await fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}))
        setErro(dados.error || 'Erro ao criar aluno.')
        return
      }
    }

    setModalAberto(false)
    await carregarAlunos()
  }

  async function excluirAluno(id) {
    const confirmar = window.confirm('Deseja realmente excluir este aluno?')
    if (!confirmar) return

    const { error } = await supabase.from('alunos').delete().eq('id', id)

    if (error) {
      setErro('Erro ao excluir aluno.')
      return
    }

    await carregarAlunos()
  }

  const alunosFiltrados = alunos.filter((a) =>
    a.nome?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Meus alunos</h2>
          <p className="text-sm text-gray-500">
            {alunos.length} aluno(s) cadastrado(s)
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar aluno..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:w-56"
          />
          <button
            onClick={abrirNovo}
            className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + Novo aluno
          </button>
        </div>
      </div>

      {erro && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="text-sm text-gray-500">Carregando alunos...</p>
      ) : alunosFiltrados.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Nenhum aluno encontrado.
        </p>
      ) : (
        <>
          {/* Tabela para telas médias/grandes */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alunosFiltrados.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {aluno.nome}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {aluno.email || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {aluno.telefone || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => abrirEdicao(aluno)}
                        className="mr-3 text-sm font-medium text-primary hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirAluno(aluno.id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards para telas pequenas */}
          <div className="flex flex-col gap-3 sm:hidden">
            {alunosFiltrados.map((aluno) => (
              <div
                key={aluno.id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <p className="font-medium text-gray-800">{aluno.nome}</p>
                <p className="text-sm text-gray-500">{aluno.email || '—'}</p>
                <p className="text-sm text-gray-500">{aluno.telefone || '—'}</p>
                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => abrirEdicao(aluno)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => excluirAluno(aluno.id)}
                    className="text-sm font-medium text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <AlunoFormModal
        aberto={modalAberto}
        aluno={alunoEmEdicao}
        onFechar={() => setModalAberto(false)}
        onSalvar={salvarAluno}
      />
    </div>
  )
}
