interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label: string
}

export function Slider({ value, onChange, min, max, step, label }: SliderProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-text">{label}</label>
        <span className="text-sm text-accent font-medium">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-dark-card rounded-full appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--bg-card) ${((value - min) / (max - min)) * 100}%, var(--bg-card) 100%)`
        }}
      />
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(124, 111, 255, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(124, 111, 255, 0.4);
        }
      `}</style>
    </div>
  )
}
