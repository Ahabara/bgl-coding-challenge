import React, { useState } from "react";
import MemberForm from "./MemberForm";

const FundForm = () => {
  // initial values
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [tax, setTax] = useState("10");

  // form state
  const [disabled, setDisabled] = useState(false);

  // once submitted
  const [profit, setProfit] = useState(0);
  const [postTaxProfit, setPostTaxProfit] = useState(0);
  const [incomeTaxPayable, setIncomeTaxPayable] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    if (!isNumber(income) || parseInt(income) < 0) {
      return alert("Profit must be a positive number");
    }
    if (!isNumber(expense) || parseInt(expense) < 0) {
      return alert("Expense must be a positive number");
    }
    if (parseInt(expense) >= parseInt(income)) {
      return alert("No Profit is made. Expense must be less than income");
    }
    if (name === "") {
      return alert("Name must be filled out");
    }
    const currentProfit = Math.round(parseInt(income) - parseInt(expense));
    const taxRate = parseInt(tax) / 100;
    const incomeTax = Math.round(currentProfit * taxRate);
    setProfit(currentProfit);
    setIncomeTaxPayable(incomeTax);
    setPostTaxProfit(currentProfit - incomeTax);
    setDisabled(true);
  }

  // check string is integer
  function isNumber(str) {
    return /^\d+$/.test(str);
  }

  return (
    <div className="fund-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name-input">Name:</label>
        <input
          type="text"
          id="name-input"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={disabled}
        />

        <label htmlFor="income-input">Profit:</label>
        <input
          type="number"
          id="income-input"
          name="income"
          value={income}
          onChange={(event) => setIncome(event.target.value)}
          disabled={disabled}
        />

        <label htmlFor="expense-input">Expense:</label>
        <input
          type="number"
          id="expense-input"
          name="expense"
          value={expense}
          onChange={(event) => setExpense(event.target.value)}
          disabled={disabled}
        />

        <label htmlFor="tax-input">Tax Rate:</label>
        <select
          id="tax-input"
          name="tax-input"
          value={tax}
          disabled={disabled}
          onChange={(event) => setTax(event.target.value)}
        >
          <option value="10">10%</option>
          <option value="15">15%</option>
        </select>
        <button type="submit" disabled={disabled}>
          Submit
        </button>
      </form>
      <MemberForm
        name={name}
        profit={profit}
        incomeTaxPayable={incomeTaxPayable}
        disabled={disabled}
      />
    </div>
  );
};

export default FundForm;
