import { api } from "./api";

export interface Medico {
  id: number;
  nome: string;
  cpf: string;
  crm: string;
  especialidade: string;
  telefone: string | null;
}

export interface MedicoCreateDTO {
  nome: string;
  cpf: string;
  crm: string;
  especialidade: string;
  telefone?: string;
}

export interface MedicoUpdateDTO {
  nome?: string;
  cpf?: string;
  crm?: string;
  especialidade?: string;
  telefone?: string;
}

const ENDPOINT = "/api/medicos";

export const medicoService = {
  listarTodos: () => api.get<Medico[]>(ENDPOINT),

  buscarPorId: (id: number) => api.get<Medico>(`${ENDPOINT}/${id}`),

  criar: (data: MedicoCreateDTO) => api.post<Medico>(ENDPOINT, data),

  atualizar: (id: number, data: MedicoUpdateDTO) =>
    api.put<Medico>(`${ENDPOINT}/${id}`, data),

  deletar: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`),
};
