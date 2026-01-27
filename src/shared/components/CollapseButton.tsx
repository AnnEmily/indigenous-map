import { FC } from 'react';
import { IconButton } from '@mui/material';
import ArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const iconStyle = {
  display: 'inline-block',
  transition: 'transform 0.4s ease',
};

const rotate = {
  transform: 'rotate(180deg)',
};

interface CollapseButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const CollapseButton: FC<CollapseButtonProps> = ({ isExpanded, onToggle }) => {
  return (
    <IconButton
      aria-label="expand"
      size="small"
      onClick={onToggle}
      sx={{ ...iconStyle, ...(isExpanded ? rotate : {}) }}>
      <ArrowUpIcon />
    </IconButton>
  );
};

export default CollapseButton;
