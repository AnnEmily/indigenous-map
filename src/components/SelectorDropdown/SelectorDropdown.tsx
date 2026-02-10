import { FC, ReactNode, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, styled, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyAccordion = styled(Accordion)({
  '&.MuiPaper-root': {
    '&.Mui-expanded': {
      margin: 0,
    },
    '&.MuiAccordion-root:last-of-type': {
      borderRadius: 0,
    },
  },
  '& .MuiAccordion-heading': {
    all: 'inherit',
    backgroundColor: '#8b8b8b',
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    '&.Mui-expanded': {
      margin: 0,
    }
  },
  '& .MuiButtonBase-root.MuiAccordionSummary-root': {
    minHeight: '40px',
    borderBottom: '1px solid #7d7d7d',
  },
  '& .MuiAccordionDetails-root': {
    padding: '8px 8px 8px 14px',
    background: 'rgb(216, 216, 216)',
  },
});

interface SelectorDropdownProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const SelectorDropdown: FC<SelectorDropdownProps> = ({ title, defaultOpen = false, children }) => {
  const [openPanel, setOpenPanel] = useState<boolean>(defaultOpen);

  return (
    <MyAccordion expanded={openPanel} onChange={() => setOpenPanel(!openPanel)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span" sx={{ fontWeight: 'bold' }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </MyAccordion>
  );
};

export default SelectorDropdown;
