import { FC, ReactNode } from "react";
import { useShallow } from "zustand/shallow";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useMapStore } from "../../shared/store";
import { Panel } from "../../shared/types";
import { panelNames } from "../constants";

interface SelectorDropdownProps {
  panelId: Panel;
  children: ReactNode;
}

export const SelectorDropdown: FC<SelectorDropdownProps> = ({ panelId, children }) => {
  const { openPanel, updateOpenedPanels } = useMapStore(useShallow(state => ({
      openPanel: state.openPanels.includes(panelId),
      updateOpenedPanels: state.updateOpenedPanels,
    })));

  const title = panelNames.get(panelId);

  return (
    <Accordion
      expanded={openPanel}
      onChange={() => updateOpenedPanels(panelId, !openPanel)}
      className="accordion"
      aria-label={title}
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
