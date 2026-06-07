import { api } from "./api";
import { Medico } from "./medicoService";
import { Paciente } from "./pacienteService";

// Resposta da API — agendamento com objetos aninhados
export interface Agendamento {
  id: number;
  horario: string;       // "09:30"
  data: string;          // "2026-06-06"
  tipo: string;          // "Consulta de Rotina"
  status: string | null; // "confirmado", "em_espera", etc.
  observacoes: string | null;
  paciente: Paciente | null;
  medico: Medico | null;
}

// DTO para criação — envia IDs
export interface AgendamentoCreateDTO {
  pacienteId: number;
  medicoId: number;
  data: string;
  horario: string;
  tipo: string;
  status?: string;
  observacoes?: string;
}

export interface AgendamentoUpdateDTO {
  pacienteId?: number;
  medicoId?: number;
  data?: string;
  horario?: string;
  tipo?: string;
  status?: string;
  observacoes?: string;
}

const ENDPOINT = "/api/agendamentos";

export const agendamentoService = {
  listarTodos: () => api.get<Agendamento[]>(ENDPOINT),

  buscarPorId: (id: number) => api.get<Agendamento>(`${ENDPOINT}/${id}`),

  criar: (data: AgendamentoCreateDTO) => api.post<Agendamento>(ENDPOINT, data),

  atualizar: (id: number, data: AgendamentoUpdateDTO) =>
    api.put<Agendamento>(`${ENDPOINT}/${id}`, data),

  deletar: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`),
};
