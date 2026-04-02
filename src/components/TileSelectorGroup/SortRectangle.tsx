import { FC } from 'react';
import { Box } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { SortOrder } from '../../shared/types';

interface SortRectProps {
  label: string;
  isActive: boolean; // show arrow in this rectangle
  sortOrder: SortOrder;
  onClick: () => void;
  color?: string;
  width?: number;
  height?: number;
}

export const SortRectangle: FC<SortRectProps> = ({
  label,
  isActive,
  sortOrder,
  onClick,
  color = '#bdbdbd',
  width = 30,
  height = 14,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid gray',
        width,
        height,
        bgcolor: color,
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={onClick}
      title={label}
    >
      {isActive && (sortOrder === 'asc' ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />)}
    </Box>
  );
};
