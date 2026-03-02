import { FC } from "react";
import { Slider } from "@mui/material";
import { useShallow } from "zustand/shallow";

import { useMapStore } from "../../shared/store";
import { CheckboxSelector, SelectorDropdown } from "../../shared/components";

export const SettingsPanel: FC = () => {
    const state = useMapStore(useShallow(state => ({
      polygonThreshold: state.polygonThreshold,
      showConvexHulls: state.showConvexHulls,
      showCoords: state.showCoords,
      showZoom: state.showZoom,
      viewport: state.viewport,
      setPoygonThreshold: state.setPolygonThreshold,
      toggleShowConvexHulls: state.toggleShowConvexHulls,
      toggleShowCoords: state.toggleShowCoords,
      toggleShowZooom: state.toggleShowZoom,
    })));
  
  return (
    <SelectorDropdown panelId="settings">
      <CheckboxSelector label="Show Lat/Long" checked={state.showCoords} onToggle={state.toggleShowCoords} />
      <CheckboxSelector label="Show zoom factor" checked={state.showZoom} onToggle={state.toggleShowZooom} />
      <CheckboxSelector label="Show nations spread" checked={state.showConvexHulls} onToggle={state.toggleShowConvexHulls} />

      <div style={{ display: 'flex', flexDirection: 'column', paddingInline: '14px', border: '1px solid gray', borderRadius: '8px', marginTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
          <div>{"Polygons"}</div>
          <div>{"Dots"}</div>
        </div>
        <div style={{ margin: '0px 6px -4px 4px', }}>
          <Slider
            aria-label="Sensitivity"
            value={state.polygonThreshold}
            valueLabelDisplay="off"
            step={200}
            marks
            min={0}
            max={1800}
            size="small"
            onChange={(_, val) => state.setPoygonThreshold(val)}
            sx={{
              '& .MuiSlider-thumb.Mui-active': {
                color: 'green',
                boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
              }
            }}
          />
        </div>
      </div>
    </SelectorDropdown>
  
  );
};

export default SettingsPanel;
