import { api } from "./api";

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  condicao: string;
  dataNascimento: string | null;
  email: string | null;
  endereco: string | null;
}

export interface PacienteCreateDTO {
  nome: string;
  cpf: string;
  telefone: string;
  condicao: string;
  dataNascimento?: string;
  email?: string;
  endereco?: string;
}

export interface PacienteUpdateDTO {
  nome?: string;
  cpf?: string;
  telefone?: string;
  condicao?: string;
  dataNascimento?: string;
  email?: string;
  endereco?: string;
}

const ENDPOINT = "/api/pacientes";

export const pacienteService = {
  listarTodos: () => api.get<Paciente[]>(ENDPOINT),

  buscarPorId: (id: number) => api.get<Paciente>(`${ENDPOINT}/${id}`),

  criar: (data: PacienteCreateDTO) => api.post<Paciente>(ENDPOINT, data),

  atualizar: (id: number, data: PacienteUpdateDTO) =>
    api.put<Paciente>(`${ENDPOINT}/${id}`, data),

  deletar: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`),
};
