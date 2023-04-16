import React, { useState } from "react";

function Table(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Proportion</th>
          <th>Pension?</th>
        </tr>
      </thead>
      <tbody>{props.members.map(props.displayTable)}</tbody>
    </table>
  );
}

function Report({
  name,
  members,
  displayTable,
  totalProportion,
  profit,
  incomeTaxPayable,
}) {
  return (
    <div>
      <h2>Report for {name} (SMSF)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Proportion</th>
            <th>Pension</th>
            <th>Profit</th>
            <th>Tax</th>
          </tr>
        </thead>
        <tbody>
          {members.map(displayTable)}
          <tr className="table-total">
            <td>Total</td>
            <td>{totalProportion}%</td>
            <td>N/A</td>
            <td>${profit}</td>
            <td>${incomeTaxPayable}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const MemberForm = ({ name, profit, incomeTaxPayable, disabled }) => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    proportion: "",
    isPension: false,
    profit: 0,
    incomeTaxPayable: 0,
  });
  const [totalProportion, setTotalProportion] = useState(0);
  const [totalTaxableProportion, setTotalTaxableProportion] = useState(0);

  const [showReport, setShowReport] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setNewMember({ ...newMember, [name]: newValue });
  };

  function isNumber(str) {
    return /^\d+$/.test(str);
  }

  const handleAddMember = (event) => {
    event.preventDefault();
    if (
      !isNumber(newMember.proportion) ||
      parseInt(newMember.proportion) <= 0
    ) {
      return alert("Proportion must be a positive integer greater than 0");
    }
    if (newMember.proportion === "") {
      return alert("Proportion must not be blank");
    }
    if (totalProportion + parseInt(newMember.proportion) > 100) {
      return alert("Total Proportion must be less than or equal to 100");
    }
    if (newMember.name === "") {
      return alert("Name must be filled out");
    }
    const newMembers = [...members, newMember];
    setMembers(newMembers);
    setNewMember({
      name: "",
      proportion: "",
      isPension: false,
      profit: 0,
      incomeTaxPayable: 0,
    });
    setTotalProportion(
      newMembers.reduce((acc, member) => acc + Number(member.proportion), 0)
    );
    setTotalTaxableProportion(
      newMembers.reduce(
        (acc, member) =>
          member.isPension ? acc : acc + Number(member.proportion),
        0
      )
    );
  };

  function allocateProfit() {
    members.forEach((member) => {
      const proportion = parseInt(member.proportion);
      const proportionOfTaxableProfit = Math.round(
        (proportion / totalTaxableProportion) * profit
      );
      const proportionOfProfit = Math.round(
        (proportion / totalProportion) * profit
      );
      member.profit = proportionOfProfit;
      if (member.isPension) {
        member.incomeTaxPayable = 0;
      } else {
        member.incomeTaxPayable = Math.round(
          (proportionOfTaxableProfit * incomeTaxPayable) / profit
        );
      }
    });
  }

  function reconcileDifference() {
    const totalProfit = members.reduce((acc, member) => acc + member.profit, 0);
    let totalAllocatedTax = 0;
    for (let i = 0; i < members.length; i++) {
      totalAllocatedTax = totalAllocatedTax + members[i].incomeTaxPayable;
    }
    const taxDifference = incomeTaxPayable - totalAllocatedTax;
    const profitDifference = profit - totalProfit;
    console.log("Members before", members);
    console.log("Profit difference", profitDifference);
    console.log("Tax difference", taxDifference);
    members[0].profit += profitDifference;
    let largestProportion = 0;
    let largestProportionIndex = 0;
    for (let i = 0; i < members.length; i++) {
      if (members[i].proportion > largestProportion && !members[i].isPension) {
        largestProportion = members[i].proportion;
        largestProportionIndex = i;
      }
    }
    members[largestProportionIndex].incomeTaxPayable += taxDifference;
  }

  function handleGenerateReport() {
    if (!disabled) {
      return alert("Please complete and submit the Fund Form First");
    }
    allocateProfit();
    reconcileDifference();
    console.log("Members after", members);
    setShowReport(true);
  }

  return (
    <div>
      <h1 className="title">Member Form</h1>
      <form onSubmit={handleAddMember}>
        <label htmlFor="name-input">Name:</label>
        <input
          type="text"
          id="name-input"
          name="name"
          value={newMember.name}
          onChange={handleInputChange}
        />

        <label htmlFor="proportion-input">Proportion:</label>
        <input
          type="number"
          id="proportion-input"
          name="proportion"
          value={newMember.proportion}
          onChange={handleInputChange}
        />

        <label htmlFor="is-pension-input">Pension:</label>
        <input
          type="checkbox"
          id="is-pension-input"
          name="isPension"
          checked={newMember.isPension}
          onChange={handleInputChange}
        />

        <button type="submit" disabled={false}>
          Add Member
        </button>
      </form>
      <Table
        members={members}
        displayTable={(member) => (
          <tr key={members.indexOf(member)}>
            <td>{member.name}</td>
            <td>{member.proportion}%</td>
            <td>{member.isPension ? "Yes" : "No"}</td>
          </tr>
        )}
      />
      <div className="generate-info">
        <p>Total Proportion: {totalProportion}%</p>
        <p>Total Taxable Proportion: {totalTaxableProportion}%</p>
        <button
          type="button"
          disabled={!(totalProportion === 100)}
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>
      </div>
      {showReport && (
        <Report
          name={name}
          members={members}
          profit={profit}
          incomeTaxPayable={incomeTaxPayable}
          totalProportion={totalProportion}
          displayTable={(member) => (
            <tr key={members.indexOf(member)}>
              <td>{member.name}</td>
              <td>{member.proportion}%</td>
              <td>{member.isPension ? "Yes" : "No"}</td>
              <td>${member.profit}</td>
              <td>${member.incomeTaxPayable}</td>
            </tr>
          )}
        />
      )}
    </div>
  );
};

export default MemberForm;
