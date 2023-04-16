import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import FundForm from "./Components/FundForm";
import MemberForm from "./Components/MemberForm";

it("renders App header", () => {
  render(<App />);
  const titleElement = screen.getByText(/Profit and Loss Statement/i);
  expect(titleElement).toBeInTheDocument();
});

test("should call handleSubmit when user submits the Member form with no input", () => {
  const handleSubmit = jest.fn();
  const { getByText } = render(<MemberForm onSubmit={handleSubmit} />);
  const submitButton = getByText("Generate Report");

  fireEvent.click(submitButton);

  expect(handleSubmit).toHaveBeenCalledTimes(0);
});

test("should call handleSubmit when user submits the Fund form with no input", () => {
  const handleSubmit = jest.fn();
  window.alert = () => {};
  const { getByText } = render(<FundForm onSubmit={handleSubmit} />);
  const submitButton = getByText("Submit");
  fireEvent.click(submitButton);
  expect(handleSubmit).toHaveBeenCalledTimes(0);
});

// TODO tests
