import { type FC } from "react";

import { Checkbox, FormControlLabel } from '@mui/material';

import '../../Mapper.css';

interface CheckboxSelectorProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export const CheckboxSelector: FC<CheckboxSelectorProps> = ({ label, checked, onToggle }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox checked={checked} onChange={onToggle} size="small"/>
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
