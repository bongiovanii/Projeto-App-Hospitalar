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

// Relatório do dia (via procedure no backend)
export interface RelatorioDia {
  data: string;
  totalConsultas: number;
  finalizados: number;
  emEspera: number;
  agendamentos: {
    id: number;
    horario: string;
    tipo: string;
    status: string | null;
    paciente_nome: string | null;
    medico_nome: string | null;
    medico_especialidade: string | null;
  }[];
}

const ENDPOINT = "/api/agendamentos";

export const agendamentoService = {
  listarTodos: () => api.get<Agendamento[]>(ENDPOINT),

  buscarPorId: (id: number) => api.get<Agendamento>(`${ENDPOINT}/${id}`),

  criar: (data: AgendamentoCreateDTO) => api.post<Agendamento>(ENDPOINT, data),

  atualizar: (id: number, data: AgendamentoUpdateDTO) =>
    api.put<Agendamento>(`${ENDPOINT}/${id}`, data),

  deletar: (id: number) => api.delete<void>(`${ENDPOINT}/${id}`),

  // Relatório do dia via stored procedure
  relatorioDia: (data: string) => api.get<RelatorioDia>(`/api/relatorio/dia?data=${data}`),
};
