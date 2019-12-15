import React, { useState } from "react";
import "./App.scss";
import logo from "./etereo-logo.png";
import MaskedInput from "react-text-mask";

interface CalculatorData {
  baseSalary: number;
  totalPluses: number;
  contractType: string;
  contractDuration: string;
}

function App() {
  const contractTypes = ["Completa", "Parcial"];
  const contractDurations = ["Indefinido", "Temporal"];
  const defaultState: CalculatorData = {
    baseSalary: 0,
    totalPluses: 0,
    contractType: contractTypes[0],
    contractDuration: contractDurations[0]
  };
  const [formState, setFormState] = useState(defaultState);

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
              mask={[
                /[1-9]/,
                /[1-9]/,
                /[1-9]/,
                ".",
                /[1-9]/,
                /[1-9]/,
                /[1-9]/,
                ",",
                /\d/,
                /\d/,
              ]}
              guide={false}
              type="text"
              name="baseSalary"
              id="baseSalary"
              tabIndex={-1}
              autoFocus
              value={formState.baseSalary}
            />
          </div>
          <div className="form-control">
            <label htmlFor="totalPluses">Total pluses</label>
            <input
              type="number"
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
            <span>25.367,23€</span>
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
