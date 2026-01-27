import { ReactNode, type FC } from "react";
import clsx from "clsx";
import { Collapse } from "@mui/material";

import { useTheme } from "../../shared/theme/useTheme";
import CollapseButton from "./CollapseButton";
import '../../Solver.css';

interface PanelProps {
  id?: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ id, title, isOpen, onToggle, children }) => {
  const { theme } = useTheme();
  const className = clsx('panel', theme);

  return (
    <div id={id} className={className}>
      <div  onClick={onToggle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'anchor-center', cursor: 'pointer' }}>
        <div className={'panel-title'}>{title}</div>
        <CollapseButton isExpanded={isOpen} onToggle={onToggle} />
      </div>
      <Collapse in={isOpen}>
        {children}
      </Collapse>
    </div>
  );
};

export default Panel;
