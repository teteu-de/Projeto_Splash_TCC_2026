import { Logger } from '../utilitarios/Logger';


export interface ConsumptionRecord {
  id: number;
  usuario_id?: number;
  sensor?: string;
  pulsos?: number | string;
  vazao?: number | string;
  consumo?: number | string;
  consumo_acumulado?: number | string;
  data_hora?: string;
}

export interface HistoryRecord {
  periodo: string;
  consumo: number | string;
}

export interface SplashSnapshot {
  records: ConsumptionRecord[];
  todayLiters: number;
  monthLiters: number;
  currentFlowLmin: number;
  hourlyData: { hour: string; liters: number; cost: number }[];
  dailyData: { label: string; timestamp: string; liters: number; cost: number }[];
  monthlyData: { label: string; timestamp: string; liters: number; cost: number }[];
  yearlyData: { label: string; timestamp: string; liters: number; cost: number }[];
  monthlyCost: {
    categoria?: string;
    consumoLitros: number;
    consumoM3: number;
    agua: number;
    esgoto: number;
    total: number;
  };
  lastMeasurementAt: string | null;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const TOKEN_KEY = "splash_token";

export function saveAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function getJson<T>(path: string): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Sua sessão não está autenticada. Entre novamente.");
  }

  Logger.info(`Iniciando consulta à API: ${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    Logger.warn(`Sessão recusada pela API: ${path} (HTTP 401)`);
    clearAuthToken();
    throw new Error("Sua sessão expirou. Entre novamente.");
  }

  if (!response.ok) {
    Logger.error(`Falha na consulta à API: ${path}`, { status: response.status });
    throw new Error(`API ${path}: HTTP ${response.status}`);
  }

  Logger.info(`Consulta à API concluída: ${path}`, { status: response.status });
  return response.json() as Promise<T>;
}

const numeric = (value: unknown): number => {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
};

const formatTime = (dateValue: string): string => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapHistory = (
  rows: HistoryRecord[],
  mode: "hour" | "day"
) =>
  rows.map((row) => {
    const dateValue = String(row.periodo);
    const date = new Date(dateValue);

    const label = Number.isNaN(date.getTime())
      ? dateValue
      : mode === "hour"
        ? formatTime(dateValue)
        : date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });

    const liters = numeric(row.consumo);

    return {
      label,
      timestamp: dateValue,
      liters,
      cost: 0,
    };
  });

export async function fetchSplashSnapshot(): Promise<SplashSnapshot> {
  const [
    records,
    today,
    month,
    todayHistory,
    weekHistory,
    monthHistory,
    yearHistory,
    monthlyCost,
  ] = await Promise.all([
    getJson<ConsumptionRecord[]>("/api/consumo"),
    getJson<{ consumoHoje: number | string }>("/api/consumo/hoje"),
    getJson<{ consumoMes: number | string }>("/api/consumo/mes"),
    getJson<HistoryRecord[]>("/api/consumo/historico?periodo=hoje"),
    getJson<HistoryRecord[]>("/api/consumo/historico?periodo=7dias"),
    getJson<HistoryRecord[]>("/api/consumo/historico?periodo=mes"),
    getJson<HistoryRecord[]>("/api/consumo/historico?periodo=ano"),
    getJson<{
      categoria?: string;
      consumoLitros: number;
      consumoM3: number;
      agua: number;
      esgoto: number;
      total: number;
    }>("/api/consumo/custo"),
  ]);

  const latest = records[0];

  return {
    records,
    todayLiters: numeric(today.consumoHoje),
    monthLiters: numeric(month.consumoMes),
    currentFlowLmin: numeric(latest?.vazao),
    hourlyData: mapHistory(todayHistory, "hour").map((point) => ({
      hour: point.label,
      liters: point.liters,
      cost: point.cost,
    })),
    dailyData: mapHistory(weekHistory, "day"),
    monthlyData: mapHistory(monthHistory, "day"),
    monthlyCost,
    lastMeasurementAt: latest?.data_hora || null,
    yearlyData: mapHistory(yearHistory, "day").map((point) => {
  const date = new Date(point.timestamp);

  return {
    ...point,
    label: date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    }),
  };
}),
  };
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}
