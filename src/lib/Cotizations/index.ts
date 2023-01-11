export interface Cotization {
  type: string;
  employer: string;
  employee: string;
  min: string;
  max: string;
}

export const cotizations: Array<Cotization> = [
  {
    type: "Contingencias comunes",
    employer: "23.60",
    employee: "4.70",
    min: "",
    max: ""
  },
  {
    type: "Accidentes de trabajo",
    employer: "",
    employee: "",
    min: "1050.00",
    max: "4070.10"
  },
  {
    type: "Horas extraordinarias (fuerza mayor)",
    employer: "12.00",
    employee: "2.00",
    min: "",
    max: ""
  },
  {
    type: "Horas extraordinarias",
    employer: "23.60",
    employee: "4.70",
    min: "",
    max: ""
  },
  {
    type: "Desempleo indefinido",
    employer: "5.50",
    employee: "1.55",
    min: "",
    max: ""
  },
  {
    type: "Desempleo temporal completa",
    employer: "6.70",
    employee: "1.60",
    min: "",
    max: ""
  },
  {
    type: "Desempleo temporal parcial",
    employer: "6.70",
    employee: "1.60",
    min: "",
    max: ""
  },
  {
    type: "Fogasa",
    employer: "0.20",
    employee: "",
    min: "",
    max: ""
  },
  {
    type: "Formación profesional",
    employer: "0.60",
    employee: "0.10",
    min: "",
    max: ""
  }
];
