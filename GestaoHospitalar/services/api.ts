// ============================================================
// Configuração base da API
// Altere a BASE_URL para o endereço do seu backend
// ============================================================

const BASE_URL = "http://192.168.100.17:8080"; // Android Emulator → localhost
// const BASE_URL = "http://localhost:8080"; // Web
// const BASE_URL = "http://192.168.x.x:8080"; // Dispositivo físico (use o IP da sua máquina)

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Erro ${response.status}: ${errorBody || response.statusText}`
      );
    }

    // DELETE pode retornar 204 sem body
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`[API] Falha em ${options.method || "GET"} ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
