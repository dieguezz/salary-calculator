import React, { useState } from "react";
import "./App.scss";
import logo from "./etereo-logo.png";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import axios from "axios";
import { useEffect } from "react";
import { Modal } from "./Modal";

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
  totalPluses: number
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
  const [otherCosts, setOtherCosts] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [isCotizationBaseOpen, setIsCotizationBaseOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isCommonContOpen, setIsCommonContOpen] = useState(false);
  const [isPlusesOpen, setIsPlusesOpen] = useState(false);
  const [isFogasaOpen, setIsFogasaOpen] = useState(false);
  const [isUnemploymentOpen, setIsUnemploymentOpen] = useState(false);
  const [isFormationOpen, setIsFormationOpen] = useState(false);

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
    console.log(number);
    if (isLoading || number < 400) return;
    setIsloading(true);
    fetchSalary(
      number,
      formState.contractDuration === "Indefinido" ? 1 : 0,
      formState.contractType === "Partial" ? 1 : 0,
      formState.totalPluses || 0
    ).then((res: any) => {
      console.log(res.data);
      setCost(res.data.totalCost.toString().replace(".", ","));
      setOtherCosts(res.data.detailedCosts);
      setIsloading(false);
    });
  }

  function toggleModal(name: string) {
    switch (name) {
      case "cotizationBase":
        setIsCotizationBaseOpen(true);
        break;
      case "pluses":
        setIsPlusesOpen(true);
        break;
      case "duration":
        setIsDurationOpen(true);
        break;
      case "desempleo":
        setIsUnemploymentOpen(true);
        break;
      case "cont. comunes":
        setIsCommonContOpen(true);
        break;
      case "fogasa":
        setIsFogasaOpen(true);
        break;
      case "formación prof.":
        setIsFormationOpen(true);
        break;
      default:
        throw new Error("no such type");
    }
  }

  useEffect(() => {
    getSalary();
  }, [formState]);

  return (
    <div className="salary-calculator">
      <header>
        <h1 className="h1">Calcular coste trabajador</h1>
        <p className="description">
          Calcula el coste que le supone a tu empresa contratar a un trabajador
          en base a su salario bruto anual.
        </p>
      </header>
      <div className="content">
        <form
          className="salary-form"
          onSubmit={onSubmitForm}
          onChange={onChangeForm}
        >
          <div className="form-control">
            <label
              htmlFor="baseSalary"
              className="h2"
              onClick={() => setIsCotizationBaseOpen(true)}
            >
              Salario base mensual <span className="asterisc">*</span>
            </label>
            <MaskedInput
              className="input"
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
            <label
              htmlFor="totalPluses"
              className="h2"
              onClick={() => setIsPlusesOpen(true)}
            >
              Total pluses <span className="asterisc">*</span>
            </label>
            <MaskedInput
              className="input"
              mask={numberMask}
              guide={false}
              type="text"
              name="totalPluses"
              id="totalPluses"
              value={formState.totalPluses}
            />
          </div>
          <div className="form-control">
            <label
              htmlFor="contractDuration"
              className="h2"
              onClick={() => setIsDurationOpen(true)}
            >
              Duración del contrato <span className="asterisc">*</span>
            </label>
            <select
              id="contractDuration"
              name="contractDuration"
              className="input"
            >
              {contractDurations.map(i => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="contractType" className="h2">
              Tipo de jornada
            </label>
            <select id="contractType" name="contractType" className="input">
              {contractTypes.map(i => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </form>
        <div className="result">
          <div className="total-cost">
            <label htmlFor="totalCost">Coste Total para la empresa</label>
            <MaskedInput
              mask={numberMask}
              guide={false}
              type="text"
              name="totalCost"
              id="totalCost"
              value={cost}
              disabled
            />
          </div>
          <ul className="other-costs">
            {otherCosts.map((otherCost: any) => (
              <li className="cost-item" key={otherCost.name}>
                <label htmlFor={otherCost.name} onClick={() => toggleModal(otherCost.name)}>
                  {otherCost.rate} {otherCost.name} <span className="asterisc-small">*</span>
                </label>
                <MaskedInput
                  mask={numberMask}
                  guide={false}
                  type="text"
                  name={otherCost.name}
                  id={otherCost.name}
                  value={otherCost.total}
                  disabled
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <footer>
        <img src={logo} className="etereo-logo" alt="etereo logo" />
        <p className="salary-feedback">
          Si tienes dudas o sugerencias, escribe a{" "}
          <a className="etereo-link" href="mailto:dev@etereo.io">
            dev@etereo.io
          </a>
        </p>
      </footer>
      <Modal
        isOpen={isCotizationBaseOpen}
        title="Salario Base"
        onClose={() => setIsCotizationBaseOpen(false)}
        text="Es la retribución fijada por unidad de tiempo o de obra."
        source="http://www.mitramiss.gob.es/es/Guia/texto/guia_6/contenidos/guia_6_13_1.htm"
      ></Modal>
      <Modal
        isOpen={isPlusesOpen}
        title="Complementos salariales"
        onClose={() => setIsPlusesOpen(false)}
        text="Es la retribución fijada en función de circunstancias relativas a: Las condiciones personales del trabajador. Al trabajo realizado. A la situación y resultados de la empresa. Puede pactarse que sean consolidables o no, no teniendo el carácter consolidable, salvo acuerdo en contrario, los que estén vinculados al puesto de trabajo o a la situación y resultados de la empresa. Entre los complementos salariales que normalmente se pactan en la negociación colectiva cabe destacarse: La antigüedad. Las pagas extraordinarias. La participación en beneficios. Los complementos del puesto de trabajo, tales como penosidad, toxicidad, peligrosidad, turnos, trabajo nocturno, etc. Primas a la producción por calidad o cantidad de trabajo. Residencia en provincias insulares y Ceuta y Melilla, etc."
        source="http://www.mitramiss.gob.es/es/Guia/texto/guia_6/contenidos/guia_6_13_1.htm"
      ></Modal>
      <Modal
        isOpen={isDurationOpen}
        title="Duración del contrato"
        onClose={() => setIsDurationOpen(false)}
        text={
          formState.contractDuration === "Indefinido"
            ? "El contrato indefinido es aquel que se concierta sin establecer límites de tiempo en la prestación de los servicios, en cuanto a la duración del contrato. El contrato de trabajo indefinido podrá ser verbal o escrito y podrá celebrarse a jornada completa, parcial o para la prestación de servicios fijos discontinuos. Los contratos indefinidos pueden en algunos casos ser beneficiarios de Incentivos a la contratación, cuando se cumplan los requisitos que en cada caso se exijan por la Normativa de aplicación, dependiendo de las características de la empresa, del trabajador y, en su caso, de la jornada."
            : "El contrato temporal, es aquel que tiene por objeto el establecimiento de una relación laboral entre empresario y trabajador por un tiempo determinado. El contrato de trabajo temporal podrá celebrarse a jornada completa o parcia, se formalizará por escrito, podrá ser verbal cuando en la situación de eventual por circunstancias de la producción la duración del mismo sea inferior a cuatro semanas y la jornada completa."
        }
        source="https://www.sepe.es/HomeSepe/empresas/Contratos-de-trabajo/modelos-contrato.html"
      ></Modal>
      <Modal
        isOpen={isCommonContOpen}
        title="Contingencias comunes"
        onClose={() => setIsCommonContOpen(false)}
        text="Se entiende por contingencia común aquella situación en la que un
          trabajador, por causa de un accidente o enfermedad no laboral, se
          encuentra imposibilitado para el desarrollo de su trabajo y recibe
          asistencia sanitaria por parte del Sistema Público de Salud. La
          situación de contingencia común viene determinada por los facultativos
          de la Seguridad Social; siendo potestad de estos la expedición de la
          baja y el alta médicas."
        source="http://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/583"
      ></Modal>
      <Modal
        isOpen={isUnemploymentOpen}
        title="Desempleo"
        onClose={() => setIsUnemploymentOpen(false)}
        text="Es precio de la cuota obligatoria por desempleo, salvo para excepciones detalladas en la fuente."
        source="http://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10957/583"
      ></Modal>
      <Modal
        isOpen={isFogasaOpen}
        title="Fogasa"
        onClose={() => setIsFogasaOpen(false)}
        text="Organismo autónomo adscrito al Ministerio de Trabajo, Migraciones y Seguridad Social que garantiza a los trabajadores la percepción de salarios, así como las indemnizaciones por despido o extinción de la relación laboral, pendientes de pago a causa de insolvencia o procedimiento concursal del empresario."
        source="http://www.mitramiss.gob.es/fogasa/faqs.html"
      ></Modal>
      <Modal
        isOpen={isFormationOpen}
        title="Formación profesional"
        onClose={() => setIsFormationOpen(false)}
        text="El sistema de formación profesional para el empleo en el ámbito laboral se financiará, de conformidad con lo establecido en la Ley de Presupuestos Generales del Estado, con los fondos provenientes de la cuota de formación profesional que aportan las empresas y los trabajadores, con las ayudas procedentes del Fondo Social Europeo, o de otras ayudas e iniciativas europeas, y con las aportaciones específicas establecidas en el presupuesto del Servicio Público de Empleo Estatal.
De la misma manera, y al objeto de garantizar la universalidad y sostenimiento del sistema, este se podrá financiar con cuantas cotizaciones por formación profesional pudieran establecerse a otros colectivos beneficiarios en la Ley de Presupuestos Generales del Estado de cada ejercicio."
        source="http://www.mitramiss.gob.es/es/Guia/texto/guia_4/contenidos/guia_4_10_1.htm"
      ></Modal>
    </div>
  );
}

export default App;
