import React, { useState } from "react";
import "./App.scss";
import logo from "./etereo-logo.png";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import axios from "axios";
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
  contractType: number,
  totalPluses: number,
) {
  return axios.get(
    "https://europe-west2-finance-tools-5919b.cloudfunctions.net/salary",
    {
      params: {
        base_salary: baseSalary,
        contract_duration: contractDuration,
        contract_type: contractType,
        pluses: totalPluses
      }
    }
  );
}

function App() {
  const contractTypes = ["Completa", "Parcial"];
  const contractDurations = ["Indefinido", "Temporal"];
  const defaultState: CalculatorData = {
    baseSalary: "1000",
    totalPluses: 0,
    contractType: contractTypes[0],
    contractDuration: contractDurations[0]
  };
  const [formState, setFormState] = useState(defaultState);
  const [cost, setCost] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [isLoading, setIsloading] = useState(false);

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
    const number = parseFloat(
      formState.baseSalary.replace(".", "").replace("€", "")
    );
    console.log(number)
    if (isLoading || number < 400) return;
    setIsloading(true);
    fetchSalary(
      number,
      formState.contractDuration === "Indefinido" ? 1 : 0,
      formState.contractType === "Partial" ? 1 : 0,
      formState.totalPluses
    ).then((res: any) => {
      console.log(res.data)
      setCost(res.data.totalCost.toString().replace('.', ','));
      setOtherCosts(res.data.detailedCosts)
      setIsloading(false);
    });
  }

  useEffect(() => {
    getSalary();
  }, [formState]);

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
              name="totalCost"
              value={cost}
              disabled
            />
          </div>
          <div className="other-costs">
            <div className="cost-item">
              <span>Contingencias comunes</span>
              <MaskedInput
                mask={numberMask}
                guide={false}
                type="text"
                name="common"
                value={otherCosts.common}
                disabled
              />
            </div>
            <div className="cost-item">
              <span>Desempleo</span>
              <MaskedInput
                mask={numberMask}
                guide={false}
                type="text"
                name="unemployment"
                value={otherCosts.unemployment}
                disabled
              />
            </div>
            <div className="cost-item">
              <span>Formación profesional</span>
              <MaskedInput
                mask={numberMask}
                guide={false}
                type="text"
                name="formation"
                value={otherCosts.formation}
                disabled
              />
            </div>
            <div className="cost-item">
              <span>Fogasa</span>
              <MaskedInput
                mask={numberMask}
                guide={false}
                type="text"
                name="fogasa"
                value={otherCosts.fogasa}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
