import React from 'react';
import { RainfallLayer } from '@/lib/data';

interface LayerToggleProps {
  selectedLayer: RainfallLayer;
  onLayerChange: (layer: RainfallLayer) => void;
  className?: string;
}

const LAYERS: { id: RainfallLayer; label: string; tooltip: string }[] = [
  {
    id: 'raw',
    label: 'Raw',
    tooltip: 'Direct numerical weather prediction output before ML bias calibration',
  },
  {
    id: 'corrected',
    label: 'Corrected',
    tooltip: 'AI-adjusted forecast incorporating historical error compensation',
  },
  {
    id: 'observed',
    label: 'Observed',
    tooltip: 'Ground-truth automated telemetry from AWS stations & rain gauges',
  },
];

export default function LayerToggle({
  selectedLayer,
  onLayerChange,
  className = '',
}: LayerToggleProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <span id="layer-toggle-label" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Visualization Layer
      </span>
      <div
        role="group"
        aria-labelledby="layer-toggle-label"
        className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner"
      >
        {LAYERS.map((layer) => {
          const isSelected = selectedLayer === layer.id;
          return (
            <button
              key={layer.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={layer.tooltip}
              onClick={() => onLayerChange(layer.id)}
              className={`py-2 px-3 text-center rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                isSelected
                  ? 'bg-blue-700 text-white shadow-sm font-bold scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
