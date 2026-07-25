import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PALETTES,
  currentMode,
  currentPalette,
  toggleMode,
  setPalette,
  type Palette,
} from '../lib/theme'
import './theme-controls.css'

const PALETTE_LABELS: Record<Palette, string> = {
  blueberry: 'Blueberry & Mint',
  grape: 'Grape Soda',
  forest: 'Forest & Berry',
  ocean: 'Ocean & Coral',
  contrast: 'High Contrast',
}

/** Palette picker + light/dark toggle, usable on any page (drives lib/theme). */
export default function ThemeControls() {
  const { t } = useTranslation()
  const [mode, setModeState] = useState(currentMode())
  const [palette, setPaletteState] = useState<Palette>(currentPalette())

  return (
    <div className="theme-controls">
      <label className="sr-only" htmlFor="palette-picker">
        {t('theme.palette')}
      </label>
      <select
        id="palette-picker"
        className="palette-select"
        value={palette}
        title={t('theme.palette')}
        onChange={(e) => {
          const p = e.target.value as Palette
          setPalette(p)
          setPaletteState(p)
        }}
      >
        {PALETTES.map((p) => (
          <option key={p} value={p}>
            {PALETTE_LABELS[p]}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="mode-toggle"
        title={t('theme.toggleMode')}
        aria-label={t('theme.toggleMode')}
        onClick={() => {
          toggleMode()
          setModeState(currentMode())
        }}
      >
        <span aria-hidden="true">{mode === 'dark' ? '☀' : '☾'}</span>
      </button>
    </div>
  )
}
