import React, { useState } from "react";
import "./App.scss";
import logo from "./etereo-logo.png";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import axios from 'axios'
import { useEffect } from "react";

const numberMask = createNumberMask({
  prefix: "",
  suffix: " €",
  thousandsSeparatorSymbol: ".",
  allowLeadingZeroes: false,
  decimalSymbol: ",",
  allowDecimal: true
});

interface CalculatorData {
  baseSalary: string;
  totalPluses: number;
  contractType: string;
  contractDuration: string;
}

function fetchSalary(
  baseSalary: number,
  contractDuration: number,
  contractType: number
) {
  return axios.get(
    "https://europe-west2-finance-tools-5919b.cloudfunctions.net/salary",
    {
      params: {
        base_salary: baseSalary,
        contract_duration: contractDuration,
        contract_type: contractType
      }
    }
  );
}

function App() {
  const contractTypes = ["Completa", "Parcial"];
  const contractDurations = ["Indefinido", "Temporal"];
  const defaultState: CalculatorData = {
    baseSalary: '1000',
    totalPluses: 0,
    contractType: contractTypes[0],
    contractDuration: contractDurations[0]
  };
  const [formState, setFormState] = useState(defaultState);
  const [cost, setCost] = useState(0);

  function onChangeForm(e: any) {
    e.persist();
    setFormState((state: CalculatorData) => ({
      ...state,
      [e.target.name]: e.target.value
    }));
  }

  function onSubmitForm(e: any) {
    e.preventDefault();
  }

  function getSalary() {
    fetchSalary(formState.baseSalary.replace('.', '').replace('€', ''), formState.contractDuration === 'Indefinido' ? 0 : 1, formState.contractType === 'Partial' ? 1 : 0).then((res: any) => {
      setCost(res.data.salary)
    })
  }

  useEffect(() => {
    getSalary()
  }, [formState])

  return (
    <div className="salary-calculator">
      <header className="salary-calculator-header">
        <h1 className="salary-calculator-title">Calcular coste trabajador</h1>
        <p className="salary-info-text">
          Calcula el coste que le supone a tu empresa contratar a un trabajador
          en base a su salario bruto anual.
        </p>
        <p className="salary-feedback">
          Si tienes dudas o sugerencias, escribe a{" "}
          <a className="etereo-link" href="mailto:dev@etereo.io">
            dev@etereo.io
          </a>
        </p>
        {/* <img src={logo} className="etereo-logo" alt="etereo" /> */}
      </header>
      <div className="salary-calculator-content">
        <form
          className="salary-form"
          onSubmit={onSubmitForm}
          onChange={onChangeForm}
        >
          <div className="form-control">
            <label htmlFor="baseSalary">Base de cotización</label>
            <MaskedInput
              mask={numberMask}
              guide={false}
              type="text"
              name="baseSalary"
              id="baseSalary"
              autoFocus
              value={formState.baseSalary}
            />
          </div>
          <div className="form-control">
            <label htmlFor="totalPluses">Total pluses</label>
            <MaskedInput
              mask={numberMask}
              guide={false}
              type="text"
              name="totalPluses"
              id="totalPluses"
              value={formState.totalPluses}
            />
          </div>
          <div className="form-control">
            <label htmlFor="contractDuration">Duración del contrato</label>
            <select id="contractDuration" name="contractDuration">
              {contractDurations.map(i => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="contractType">Tipo de jornada</label>
            <select id="contractType" name="contractType">
              {contractTypes.map(i => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </form>
        <div className="salary-result">
          <div className="result-cost">
            <span>Coste Total para la empresa</span>
            <MaskedInput
              mask={numberMask}
              guide={false}
              type="text"
              name="baseSalary"
              value={cost}
              disabled
            />{" "}
          </div>
          <div className="result-cost">
            <span>Coste Total para el trabajador</span>
            <span>25.367,23€</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
