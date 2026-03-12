import { type FC } from "react";
import { Checkbox, FormControlLabel } from '@mui/material';

interface SelectorEntryProps {
  label: string;
  isChecked: boolean;
  indeterminate?: boolean;
  onToggle: () => void;
  communityCount: number;
  bgColor: string;
}

export const SelectorEntry: FC<SelectorEntryProps> = ({
   label,
   isChecked,
   indeterminate,
   onToggle,
   communityCount,
   bgColor,
}) => {
  return (
    <div style={{ display: 'flex', gap: '0px' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            indeterminate={indeterminate}
            onChange={onToggle}
            name={label}
            sx={{ paddingTop: '1px', paddingBottom: '1px' }}
          />
        }
        label={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>{label}</div>
            <div>{`${communityCount}`}</div>
          </div>
        }
        className="selector-typography"
        sx={{ '& .MuiTypography-root' : { background: bgColor } }}
      />
    </div>
  );
};

export default SelectorEntry;
