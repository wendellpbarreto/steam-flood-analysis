import type { PresetData } from "../../data/presets";

export interface FieldUsage {
  field: string;
  usedIn: string[];
  required: boolean;
  description: string;
}

export const COMMON_DATA_FIELD_USAGE: FieldUsage[] = [
  {
    field: "Eb",
    usedIn: ["Item H - Balanço de Energia"],
    required: true,
    description:
      "Eficiência do gerador - usado no cálculo de energia requerida no gerador",
  },
  {
    field: "Tb",
    usedIn: ["Item G - ROV Equivalente (entalpia caldeira)"],
    required: true,
    description:
      "Temperatura na caldeira - usado para calcular entalpia na caldeira",
  },
  {
    field: "Ts",
    usedIn: ["Item A - Área Aquecida (ΔT)", "Item E - Volume de Vapor"],
    required: true,
    description:
      "Temperatura da zona de vapor - usado em cálculos de variação de temperatura",
  },
  {
    field: "Tr",
    usedIn: ["Item A - Área Aquecida (ΔT)", "Item E - Volume de Vapor"],
    required: true,
    description:
      "Temperatura inicial do reservatório - usado em cálculos de variação de temperatura",
  },
  {
    field: "Ps",
    usedIn: [],
    required: false,
    description:
      "Pressão do vapor - informativo, não usado diretamente nos cálculos",
  },
  {
    field: "K2",
    usedIn: [],
    required: false,
    description:
      "Condutividade térmica das camadas adjacentes - pode ser usado em cálculos futuros de tempo crítico",
  },
  {
    field: "rho1C1",
    usedIn: ["Item A - Área Aquecida"],
    required: true,
    description:
      "Capacidade calorífica volumétrica da zona de vapor - usado no cálculo da área aquecida",
  },
  {
    field: "rho2C2",
    usedIn: [],
    required: false,
    description:
      "Capacidade calorífica volumétrica das camadas adjacentes - pode ser usado em cálculos futuros",
  },
  {
    field: "tYears",
    usedIn: ["Item A - Área Aquecida (tempo total)"],
    required: true,
    description: "Tempo de injeção - usado para calcular calor total injetado",
  },
  {
    field: "So",
    usedIn: ["Item F - ROV"],
    required: true,
    description:
      "Saturação inicial de óleo - usado no cálculo de volume de óleo produzido",
  },
  {
    field: "Sor",
    usedIn: ["Item F - ROV"],
    required: true,
    description:
      "Saturação residual de óleo - usado no cálculo de volume de óleo produzido",
  },
  {
    field: "gammaO",
    usedIn: ["Item H - Balanço de Energia"],
    required: true,
    description:
      "Densidade relativa do óleo - usado na correlação de energia do óleo",
  },
  {
    field: "phi",
    usedIn: ["Item F - ROV", "Área do padrão"],
    required: true,
    description:
      "Porosidade - usado no cálculo de volume de óleo e área do padrão",
  },
  {
    field: "zn",
    usedIn: ["Item A - Área Aquecida", "Item F - ROV", "Área do padrão"],
    required: true,
    description: "Espessura líquida - usado em múltiplos cálculos",
  },
  {
    field: "zt",
    usedIn: [],
    required: false,
    description: "Espessura total - pode ser usado em cálculos futuros",
  },
  {
    field: "fsd",
    usedIn: ["Item A - Área Aquecida (entalpia)", "Item E - Volume de Vapor"],
    required: true,
    description:
      "Qualidade do vapor no reservatório - usado no cálculo de entalpia",
  },
  {
    field: "Fsb",
    usedIn: ["Item G - ROV Equivalente (entalpia caldeira)"],
    required: true,
    description:
      "Qualidade do vapor na caldeira - usado no cálculo de entalpia na caldeira",
  },
  {
    field: "Lv",
    usedIn: [
      "Item A - Área Aquecida (entalpia)",
      "Item E - Volume de Vapor",
      "Item G - ROV Equivalente",
    ],
    required: true,
    description:
      "Calor de vaporização - usado em múltiplos cálculos de entalpia",
  },
  {
    field: "rhoW",
    usedIn: ["Item E - Volume de Vapor"],
    required: true,
    description:
      "Densidade da água - usado no cálculo de volume de vapor necessário",
  },
  {
    field: "CwTs",
    usedIn: ["Item A - Área Aquecida (entalpia)", "Item E - Volume de Vapor"],
    required: true,
    description:
      "Entalpia da água líquida a Ts - usado no cálculo de entalpia no reservatório",
  },
  {
    field: "CwTr",
    usedIn: ["Item E - Volume de Vapor"],
    required: true,
    description:
      "Entalpia da água líquida a Tr - usado no cálculo de volume de vapor",
  },
  {
    field: "CwTb",
    usedIn: ["Item G - ROV Equivalente (entalpia caldeira)"],
    required: true,
    description:
      "Entalpia da água líquida a Tb - usado no cálculo de entalpia na caldeira",
  },
  {
    field: "fPVRef",
    usedIn: ["Área do padrão"],
    required: true,
    description:
      "Fração de poro injetado para vazão de referência - usado para calcular área do padrão",
  },
];


export function getRequiredFieldsForItemA(): string[] {
  return [
    "tYears",
    "Ts",
    "Tr",
    "zn",
    "rho1C1",
    "CwTs",
    "fsd",
    "Lv",
    "K2",
    "rho2C2",
  ];
}

export function getRequiredFieldsForAllItems(): string[] {
  return [
    "Eb",
    "Tb",
    "Ts",
    "Tr",
    "K2",
    "rho1C1",
    "rho2C2",
    "tYears",
    "So",
    "Sor",
    "gammaO",
    "phi",
    "zn",
    "zt",
    "fsd",
    "Fsb",
    "Lv",
    "rhoW",
    "CwTs",
    "CwTr",
    "CwTb",
    "fPVRef",
  ];
}

export function validateFieldsForCalculation(
  data: PresetData,
  items: ("A" | "B" | "C" | "D" | "E" | "F" | "G" | "H")[] = ["A"]
): {
  valid: boolean;
  missingFields: string[];
  unusedFields: string[];
} {
  const requiredFields = new Set<string>();

  if (items.includes("A")) {
    getRequiredFieldsForItemA().forEach((f) => requiredFields.add(f));
  }

  if (
    items.includes("B") ||
    items.includes("C") ||
    items.includes("D") ||
    items.includes("E") ||
    items.includes("F") ||
    items.includes("G") ||
    items.includes("H")
  ) {
    getRequiredFieldsForAllItems().forEach((f) => requiredFields.add(f));
  }

  const missingFields: string[] = [];
  const unusedFields: string[] = [];

  requiredFields.forEach((field) => {
    const value = data.common[field as keyof typeof data.common];
    if (value === undefined || value === null) {
      missingFields.push(field);
    }
  });

  const optionalFields = new Set(["Ps", "K2", "rho2C2", "zt"]);

  Object.keys(data.common).forEach((field) => {
    if (!requiredFields.has(field) && !optionalFields.has(field)) {
      const usage = COMMON_DATA_FIELD_USAGE.find((u) => u.field === field);
      if (usage && usage.usedIn.length === 0) {
        unusedFields.push(field);
      }
    }
  });

  return {
    valid: missingFields.length === 0,
    missingFields,
    unusedFields,
  };
}

export function validateAllModelFields(data: PresetData): {
  valid: boolean;
  missingFields: string[];
} {
  const allRequiredFields = getRequiredFieldsForAllItems();
  const missingFields: string[] = [];

  allRequiredFields.forEach((field) => {
    const value = data.common[field as keyof typeof data.common];
    if (value === undefined || value === null) {
      missingFields.push(field);
    }
  });

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
