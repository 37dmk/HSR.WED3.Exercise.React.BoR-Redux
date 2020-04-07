import React from "react";
import { Dropdown } from "semantic-ui-react";

export function YearDropdown({ value, onChange }) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear].map(
    y => ({
      value: y,
      text: y
    })
  );
  return (
    <Dropdown
      onChange={onChange}
      value={value}
      placeholder="Nach Jahr Filtern"
      fluid
      search
      selection
      options={yearOptions}
    />
  );
}
