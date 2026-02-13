import { type FC } from "react";

import { Checkbox, FormControlLabel } from '@mui/material';

import '../../Mapper.css';

interface CheckboxSelectorProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const CheckboxSelector: FC<CheckboxSelectorProps> = ({
  label,
  checked,
  onToggle,
  disabled = false
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox checked={checked} onChange={onToggle} size="small" disabled={disabled} />
      }
      label={label}
      className="selector-typography"
      sx={{
        margin: 0,
        '& .MuiButtonBase-root.MuiCheckbox-root' : {
          padding: '4px',
        }
      }}
    />
  );
};

export default CheckboxSelector;
