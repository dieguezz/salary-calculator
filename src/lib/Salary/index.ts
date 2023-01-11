import { Cotization } from "../Cotizations";

export enum ContractDuration {
  Temporal = 0,
  Undefined
}

export enum ContractType {
  Partial = 0,
  Full
}

export function getExtraPart(baseSalary: number): number {
  return (baseSalary / 12) * 2;
}

function getTotalCot(cot: Cotization): number {
  const employerCost = parseFloat(cot.employer);
  const min = parseFloat(cot.min);
  const max = parseFloat(cot.max);
  if (!min && !max) {
    return employerCost;
  }

  if (employerCost < min) {
    return min;
  }

  if (max && employerCost > max) {
    return max;
  }

  return employerCost;
}

export function getCot(cots: Array<Cotization>, cotName: String): number {
  const cot = cots.find(_cot => _cot.type === cotName);
  if (!cot) return 0;
  return getTotalCot(cot);
}

export function getPercent(amount: number, percent: number): string {
  return ((amount * percent) / 100).toFixed(2).replace(".", ",");
}

export function getSalaryCots(
  baseSalary: number,
  pluses: number,
  cots: Array<Cotization>,
  contractType: ContractType.Full | ContractType.Partial,
  contractDuration: ContractDuration.Temporal | ContractDuration.Undefined
): any {
  const extra = getExtraPart(baseSalary + pluses);
  const salary = baseSalary + pluses + extra;
  const commonCots = getCot(cots, "Contingencias comunes");
  const unemploymentType =
    contractType === ContractType.Partial
      ? "Desempleo temporal parcial"
      : "Desempleo temporal completa";
  const unemploymentCots = getCot(
    cots,
    contractDuration === ContractDuration.Undefined
      ? "Desempleo indefinido"
      : unemploymentType
  );
  const fogasaCots = getCot(cots, "Fogasa");
  const formationCots = getCot(cots, "Formación profesional");
  const costs = [
    {
      name: "parte prop. pagas extra",
      total: extra.toFixed(2).replace(".", ","),
      rate: ""
    },
    {
      name: "desempleo",
      total: getPercent(salary, unemploymentCots),
      rate: `${unemploymentCots}%`
    },
    {
      name: "cont. comunes",
      total: getPercent(salary, commonCots),
      rate: `${commonCots}%`
    },
    {
      name: "fogasa",
      total: getPercent(salary, fogasaCots),
      rate: `${fogasaCots}%`
    },
    {
      name: "formación prof.",
      total: getPercent(salary, formationCots),
      rate: `${formationCots}%`
    }
  ];
  return {
    costs,
    total:
      (salary +
      parseFloat(getPercent(salary, commonCots)) +
      parseFloat(getPercent(salary, unemploymentCots)) +
      parseFloat(getPercent(salary, fogasaCots)) +
      parseFloat(getPercent(salary, formationCots))).toFixed(2).replace('.', ',')
  };
}

export function getSalaryCosts(
  baseSalary: number,
  pluses: number,
  cots: Array<Cotization>,
  contractDuration: ContractDuration.Temporal | ContractDuration.Undefined,
  contractType: ContractType.Partial | ContractType.Full
): any {
  const { total, costs } = getSalaryCots(
    baseSalary,
    pluses,
    cots,
    contractType,
    contractDuration
  );
  return {
    totalCost: total,
    detailedCosts: costs
  };
}
