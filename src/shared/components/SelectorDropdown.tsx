import { FC, ReactNode, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SelectorDropdownProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const SelectorDropdown: FC<SelectorDropdownProps> = ({ title, defaultOpen = false, children }) => {
  const [openPanel, setOpenPanel] = useState<boolean>(defaultOpen);

  return (
    <Accordion
      expanded={openPanel}
      onChange={() => setOpenPanel(!openPanel)}
      className="accordion"
    >
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
    </Accordion>
  );
};

export default SelectorDropdown;
