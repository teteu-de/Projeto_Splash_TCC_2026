import { UserWaterProfile } from '../tipos';

export interface TariffTier {
  minM3: number;
  maxM3: number; // Infinity for unbounded
  label: string;
  waterRatePerM3?: number;
  sewageRatePerM3?: number;
  fixedWaterCost?: number;
  fixedSewageCost?: number;
  isMinTariff?: boolean;
}

export interface UtilityProvider {
  uf: string;
  stateName: string;
  cities: string[];
  providerName: string;
  category: string;
  fixedCharge: number; // Taxa fixa mensal se houver
  defaultSewageRatio: number; // e.g. 1.0 (100% da água = dobro)
  vigencia: string;
  tiers: TariffTier[];
}

export const BRAZILIAN_UTILITY_PROVIDERS: Record<string, UtilityProvider> = {
  SP: {
    uf: 'SP',
    stateName: 'São Paulo',
    cities: ['São Paulo', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'Guarulhos', 'Outra cidade SP'],
    providerName: 'SABESP',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 1.0, // 100% de esgoto (dobro do valor)
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', fixedWaterCost: 40.42, fixedSewageCost: 40.42, isMinTariff: true },
      { minM3: 10.001, maxM3: 20, label: '11–20 m³', waterRatePerM3: 6.40, sewageRatePerM3: 6.40 },
      { minM3: 20.001, maxM3: 50, label: '21–50 m³', waterRatePerM3: 15.95, sewageRatePerM3: 15.95 },
      { minM3: 50.001, maxM3: Infinity, label: '>50 m³', waterRatePerM3: 17.57, sewageRatePerM3: 17.57 }
    ]
  },
  AC: {
    uf: 'AC',
    stateName: 'Acre',
    cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Outra cidade AC'],
    providerName: 'SAERB',
    category: 'Residencial',
    fixedCharge: 40.79,
    defaultSewageRatio: 1.0,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: 'Tarifa Mínima', fixedWaterCost: 40.79, fixedSewageCost: 40.79, isMinTariff: true },
      { minM3: 10.001, maxM3: Infinity, label: '>10 m³', waterRatePerM3: 5.80, sewageRatePerM3: 5.80 }
    ]
  },
  AL: {
    uf: 'AL',
    stateName: 'Alagoas',
    cities: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo', 'Outra cidade AL'],
    providerName: 'CASAL',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 1.0,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: 'até 10 m³', waterRatePerM3: 7.28, sewageRatePerM3: 7.28 },
      { minM3: 10.001, maxM3: 15, label: '11–15 m³', waterRatePerM3: 13.90, sewageRatePerM3: 13.90 },
      { minM3: 15.001, maxM3: 20, label: '16–20 m³', waterRatePerM3: 16.069, sewageRatePerM3: 16.069 },
      { minM3: 20.001, maxM3: 30, label: '21–30 m³', waterRatePerM3: 17.169, sewageRatePerM3: 17.169 },
      { minM3: 30.001, maxM3: 40, label: '31–40 m³', waterRatePerM3: 17.723, sewageRatePerM3: 17.723 },
      { minM3: 40.001, maxM3: 50, label: '41–50 m³', waterRatePerM3: 17.957, sewageRatePerM3: 17.957 },
      { minM3: 50.001, maxM3: 90, label: '51–90 m³', waterRatePerM3: 18.075, sewageRatePerM3: 18.075 },
      { minM3: 90.001, maxM3: 150, label: '91–150 m³', waterRatePerM3: 18.177, sewageRatePerM3: 18.177 },
      { minM3: 150.001, maxM3: Infinity, label: '>150 m³', waterRatePerM3: 18.193, sewageRatePerM3: 18.193 }
    ]
  },
  AM: {
    uf: 'AM',
    stateName: 'Amazonas',
    cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Outra cidade AM'],
    providerName: 'Águas de Manaus',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 0.8, // 80% esgoto
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', waterRatePerM3: 6.4156, sewageRatePerM3: 5.1325 },
      { minM3: 10.001, maxM3: 20, label: '11–20 m³', waterRatePerM3: 12.4334, sewageRatePerM3: 9.9467 },
      { minM3: 20.001, maxM3: 30, label: '21–30 m³', waterRatePerM3: 18.9830, sewageRatePerM3: 15.1864 },
      { minM3: 30.001, maxM3: 40, label: '31–40 m³', waterRatePerM3: 25.8577, sewageRatePerM3: 20.6861 },
      { minM3: 40.001, maxM3: 60, label: '41–60 m³', waterRatePerM3: 29.8358, sewageRatePerM3: 23.8686 },
      { minM3: 60.001, maxM3: Infinity, label: '>60 m³', waterRatePerM3: 34.0186, sewageRatePerM3: 27.2149 }
    ]
  },
  CE: {
    uf: 'CE',
    stateName: 'Ceará',
    cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Maracanaú', 'Outra cidade CE'],
    providerName: 'CAGECE',
    category: 'Residencial Normal',
    fixedCharge: 0,
    defaultSewageRatio: 1.11, // ~100%+ esgoto
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', waterRatePerM3: 6.77, sewageRatePerM3: 7.52 },
      { minM3: 10.001, maxM3: 15, label: '11–15 m³', waterRatePerM3: 8.78, sewageRatePerM3: 9.61 },
      { minM3: 15.001, maxM3: 20, label: '16–20 m³', waterRatePerM3: 9.49, sewageRatePerM3: 10.42 },
      { minM3: 20.001, maxM3: 50, label: '21–50 m³', waterRatePerM3: 16.29, sewageRatePerM3: 17.90 },
      { minM3: 50.001, maxM3: Infinity, label: '>50 m³', waterRatePerM3: 28.77, sewageRatePerM3: 31.65 }
    ]
  },
  GO: {
    uf: 'GO',
    stateName: 'Goiás',
    cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Outra cidade GO'],
    providerName: 'SANEAGO',
    category: 'Residencial Normal',
    fixedCharge: 17.46,
    defaultSewageRatio: 1.0,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '1–10 m³', waterRatePerM3: 5.77, sewageRatePerM3: 5.76 },
      { minM3: 10.001, maxM3: 15, label: '11–15 m³', waterRatePerM3: 6.51, sewageRatePerM3: 6.51 },
      { minM3: 15.001, maxM3: 20, label: '16–20 m³', waterRatePerM3: 7.45, sewageRatePerM3: 7.45 },
      { minM3: 20.001, maxM3: 25, label: '21–25 m³', waterRatePerM3: 8.45, sewageRatePerM3: 8.45 },
      { minM3: 25.001, maxM3: 30, label: '26–30 m³', waterRatePerM3: 9.54, sewageRatePerM3: 9.54 },
      { minM3: 30.001, maxM3: 40, label: '31–40 m³', waterRatePerM3: 10.89, sewageRatePerM3: 10.89 },
      { minM3: 40.001, maxM3: 50, label: '41–50 m³', waterRatePerM3: 12.33, sewageRatePerM3: 12.33 },
      { minM3: 50.001, maxM3: Infinity, label: '>50 m³', waterRatePerM3: 14.06, sewageRatePerM3: 14.06 }
    ]
  },
  PB: {
    uf: 'PB',
    stateName: 'Paraíba',
    cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Outra cidade PB'],
    providerName: 'CAGEPA',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 0.8,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: 'até 10 m³', fixedWaterCost: 54.82, fixedSewageCost: 43.86, isMinTariff: true },
      { minM3: 10.001, maxM3: 20, label: '11–20 m³', waterRatePerM3: 7.08, sewageRatePerM3: 5.66 },
      { minM3: 20.001, maxM3: 30, label: '21–30 m³', waterRatePerM3: 9.32, sewageRatePerM3: 8.39 },
      { minM3: 30.001, maxM3: Infinity, label: '>30 m³', waterRatePerM3: 12.67, sewageRatePerM3: 12.67 }
    ]
  },
  PA: {
    uf: 'PA',
    stateName: 'Pará',
    cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Outra cidade PA'],
    providerName: 'COSANPA',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 0.8,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', waterRatePerM3: 4.91, sewageRatePerM3: 3.93 },
      { minM3: 10.001, maxM3: 20, label: '11–20 m³', waterRatePerM3: 7.00, sewageRatePerM3: 5.60 },
      { minM3: 20.001, maxM3: 30, label: '21–30 m³', waterRatePerM3: 9.38, sewageRatePerM3: 7.50 },
      { minM3: 30.001, maxM3: 40, label: '31–40 m³', waterRatePerM3: 10.58, sewageRatePerM3: 8.46 },
      { minM3: 40.001, maxM3: 50, label: '41–50 m³', waterRatePerM3: 14.66, sewageRatePerM3: 11.73 },
      { minM3: 50.001, maxM3: Infinity, label: '>50 m³', waterRatePerM3: 19.04, sewageRatePerM3: 15.23 }
    ]
  },
  PI: {
    uf: 'PI',
    stateName: 'Piauí',
    cities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano', 'Outra cidade PI'],
    providerName: 'Águas de Teresina',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 0.8,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', fixedWaterCost: 46.83, fixedSewageCost: 37.46, isMinTariff: true },
      { minM3: 10.001, maxM3: 25, label: '11–25 m³', waterRatePerM3: 8.72, sewageRatePerM3: 6.98 },
      { minM3: 25.001, maxM3: Infinity, label: '>25 m³', waterRatePerM3: 15.06, sewageRatePerM3: 12.05 }
    ]
  },
  RO: {
    uf: 'RO',
    stateName: 'Rondônia',
    cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal', 'Outra cidade RO'],
    providerName: 'CAERD',
    category: 'Residencial',
    fixedCharge: 57.51,
    defaultSewageRatio: 1.0,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: 'até 10 m³', fixedWaterCost: 57.51, fixedSewageCost: 0, isMinTariff: true },
      { minM3: 10.001, maxM3: 15, label: '10–15 m³', waterRatePerM3: 6.52, sewageRatePerM3: 6.52 },
      { minM3: 15.001, maxM3: 20, label: '15–20 m³', waterRatePerM3: 7.17, sewageRatePerM3: 7.17 },
      { minM3: 20.001, maxM3: 25, label: '20–25 m³', waterRatePerM3: 8.61, sewageRatePerM3: 8.61 },
      { minM3: 25.001, maxM3: 30, label: '25–30 m³', waterRatePerM3: 9.87, sewageRatePerM3: 9.87 },
      { minM3: 30.001, maxM3: 50, label: '30–50 m³', waterRatePerM3: 11.82, sewageRatePerM3: 11.82 },
      { minM3: 50.001, maxM3: Infinity, label: '>50 m³', waterRatePerM3: 14.18, sewageRatePerM3: 14.18 }
    ]
  },
  SC: {
    uf: 'SC',
    stateName: 'Santa Catarina',
    cities: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó', 'Criciúma', 'Itajaí', 'Outra cidade SC'],
    providerName: 'CASAN',
    category: 'Residencial',
    fixedCharge: 46.34,
    defaultSewageRatio: 1.0, // 100% esgoto
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', waterRatePerM3: 3.08, sewageRatePerM3: 3.08 },
      { minM3: 10.001, maxM3: 25, label: '11–25 m³', waterRatePerM3: 14.31, sewageRatePerM3: 14.31 },
      { minM3: 25.001, maxM3: 50, label: '26–50 m³', waterRatePerM3: 19.14, sewageRatePerM3: 19.14 },
      { minM3: 50.001, maxM3: Infinity, label: '>50 m³', waterRatePerM3: 24.08, sewageRatePerM3: 24.08 }
    ]
  },
  TO: {
    uf: 'TO',
    stateName: 'Tocantins',
    cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins', 'Outra cidade TO'],
    providerName: 'BRK Ambiental',
    category: 'Residencial',
    fixedCharge: 0,
    defaultSewageRatio: 0.8,
    vigencia: '2026',
    tiers: [
      { minM3: 0, maxM3: 10, label: '0–10 m³', waterRatePerM3: 6.20, sewageRatePerM3: 4.96 },
      { minM3: 10.001, maxM3: 20, label: '11–20 m³', waterRatePerM3: 9.80, sewageRatePerM3: 7.84 },
      { minM3: 20.001, maxM3: Infinity, label: '>20 m³', waterRatePerM3: 14.50, sewageRatePerM3: 11.60 }
    ]
  }
};

export const defaultUserWaterProfile: UserWaterProfile = {
  state: 'SP',
  city: 'São Paulo',
  propertyType: 'Residencial',
  hasSewageCharge: 'Sim',
  hasSocialTariff: 'Não'
};

export interface BillCalculationResult {
  m3: number;
  waterCost: number;
  sewageCost: number;
  fixedCost: number;
  subtotal: number;
  socialDiscount: number;
  totalCost: number;
  provider: UtilityProvider;
  tierSummary: string;
  hasSewage: boolean;
  sewageMultiplierNote: string;
}

export function calculateUtilityBill(
  liters: number,
  profile: UserWaterProfile = defaultUserWaterProfile
): BillCalculationResult {
  const m3 = Math.max(0.1, Number((liters / 1000).toFixed(2)));
  const provider = BRAZILIAN_UTILITY_PROVIDERS[profile.state] || BRAZILIAN_UTILITY_PROVIDERS['SP'];

  let waterCost = 0;
  let sewageCost = 0;
  let fixedCost = provider.fixedCharge || 0;
  let tierSummary = '';

  // Determine pricing based on tiers
  const isSewageActive = profile.hasSewageCharge !== 'Não';

  for (const tier of provider.tiers) {
    if (m3 <= tier.maxM3 || tier.maxM3 === Infinity) {
      tierSummary = `${provider.providerName} (${tier.label})`;

      if (tier.isMinTariff) {
        waterCost = tier.fixedWaterCost || 0;
        if (isSewageActive) {
          sewageCost = tier.fixedSewageCost !== undefined ? tier.fixedSewageCost : (waterCost * provider.defaultSewageRatio);
        }
      } else {
        const rateWater = tier.waterRatePerM3 || 6.50;
        const rateSewage = tier.sewageRatePerM3 || (rateWater * provider.defaultSewageRatio);
        waterCost = m3 * rateWater;
        if (isSewageActive) {
          sewageCost = m3 * rateSewage;
        }
      }
      break;
    }
  }

  // If no tier caught (edge cases), fallback calculation
  if (waterCost === 0) {
    const lastTier = provider.tiers[provider.tiers.length - 1];
    const rateWater = lastTier.waterRatePerM3 || 10.0;
    waterCost = m3 * rateWater;
    if (isSewageActive) {
      sewageCost = lastTier.sewageRatePerM3 ? m3 * lastTier.sewageRatePerM3 : waterCost;
    }
  }

  const subtotal = waterCost + sewageCost + fixedCost;
  const isSocial = profile.hasSocialTariff === 'Sim';
  const socialDiscount = isSocial ? subtotal * 0.5 : 0;
  const totalCost = Number(Math.max(0, subtotal - socialDiscount).toFixed(2));

  const sewageMultiplierNote = isSewageActive
    ? 'Inclui 100% de esgoto sanitário (fatura duplicada pela concessionária)'
    : 'Sem cobrança de esgoto sanitário';

  return {
    m3,
    waterCost: Number(waterCost.toFixed(2)),
    sewageCost: Number(sewageCost.toFixed(2)),
    fixedCost: Number(fixedCost.toFixed(2)),
    subtotal: Number(subtotal.toFixed(2)),
    socialDiscount: Number(socialDiscount.toFixed(2)),
    totalCost,
    provider,
    tierSummary,
    hasSewage: isSewageActive,
    sewageMultiplierNote
  };
}
