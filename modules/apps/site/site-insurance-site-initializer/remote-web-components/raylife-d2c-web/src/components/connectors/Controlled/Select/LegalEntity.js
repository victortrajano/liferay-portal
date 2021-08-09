import React from "react";

import { ControlledSelect } from ".";
import { useLegalEntity } from "../../../../hooks/useLegalEntity";

export function LegalEntityControlledSelect({ ...props }) {
  const { entities } = useLegalEntity();

  return (
    <ControlledSelect
      {...props}
    >
      {entities.map(({ name }) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </ControlledSelect>
  );
}
