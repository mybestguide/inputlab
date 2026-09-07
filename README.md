# InputLab

> High-precision, client-side input peripheral diagnostic bench engineered with scientific transparency.

InputLab provides laboratory-grade telemetry and diagnostics for mice, mechanical keyboards, and pointer devices directly within the browser without requiring native driver installations or external telemetry agents.

---

## Technical Architecture & Foundation

- **Core Framework**: React 19 + TypeScript (Strict Mode)
- **Bundler & Dev Server**: Vite 6 (ES2022 target)
- **Styling & Design System**: Tailwind CSS v4 + shadcn/ui-compatible primitives + CSS custom properties
- **Iconography**: Lucide React
- **Routing**: React Router DOM (Data Router)
- **Unit & Component Testing**: Vitest + Testing Library + JSDOM
- **End-to-End Testing**: Playwright
- **Memory Architecture**: Static bounded ring buffers (`CircularBuffer`) for zero-allocation telemetry during high-frequency sampling

---

## Directory Structure

```
├── components.json          # shadcn/ui configuration
├── e2e/                     # Playwright end-to-end test specs
│   └── smoke.spec.ts
├── playwright.config.ts     # Playwright configuration
├── vitest.config.ts         # Vitest configuration
├── src/
│   ├── components/
│   │   ├── common/          # ErrorBoundary, shared modals
│   │   ├── layout/          # Header, Sidebar, Breadcrumbs, DiagnosticShell
│   │   ├── ui/              # Button, Card, Badge, MetricCard, Container primitives
│   │   └── visualizers/     # Mouse silhouette, VirtualKeyboard, Gauges, Histograms
│   ├── core/
│   │   ├── engines/         # CircularBuffer, Telemetry Engine
│   │   ├── heuristics/      # Chatter and bounce detection algorithms
│   │   └── storage/         # Client-side session CSV/JSON exporters
│   ├── hooks/               # useMouseTest, useKeyboardTest, useBrowserCapabilities, useTheme
│   ├── lib/
│   │   ├── math/            # Statistical analyzers (mean, median, stdev, percentiles)
│   │   ├── utils/           # Audio feedback generator, cn class merger
│   │   └── utils.ts         # Standard shadcn utils re-export
│   ├── routes/              # Page components & React Router tree
│   ├── styles/
│   │   └── tokens.ts        # Typed design tokens (colors, spacing, radius, typography)
│   ├── test/
│   │   ├── setup.ts         # Test environment setup (matchers, polyfills)
│   │   ├── test-utils.tsx   # Custom render wrapper & mock event builders
│   │   └── foundation.test.tsx # Foundational unit tests
│   ├── types/               # Shared TypeScript domain contracts
│   │   ├── device.ts        # Device pillars & test identifiers
│   │   ├── environment.ts   # Browser API capability interfaces
│   │   ├── events.ts        # Normalized PointerEvent & KeyboardEvent records
│   │   ├── metrics.ts       # Statistical sample summaries
│   │   ├── results.ts       # Diagnostic verdicts & anomaly records
│   │   └── index.ts         # Master types barrel export
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # CSS variables & typography tokens
```

---

## Design System Tokens

InputLab features an instrument-grade metrology design system:

- **Monochromatic Cool Palette**: Neutral surfaces (`#0B0F17` dark, `#F8FAFC` light) with subtle blue undertones.
- **Instrument Cyan Accent**: `#0284C7` (light) / `#38BDF8` (dark) for focused interactive controls and key actuation states.
- **Diagnostic Status Indicators**:
  - `Pass` (`#059669` / `#34D399`): Verified switch, NKRO verified, clean contacts.
  - `Warning` (`#D97706` / `#FBBF24`): Degraded cadence, suspect rate variance.
  - `Defect` (`#DC2626` / `#F87171`): Electrical contact bounce / chatter anomaly detected.
- **Typography Pairing**: Plus Jakarta Sans for UI scaffolding paired with JetBrains Mono (with `tabular-nums`) for scancodes and timing readouts.
- **Accessibility**: WCAG 2.1 AA contrast compliance, prominent keyboard focus rings, and strict `@media (prefers-reduced-motion: reduce)` behavior.

---

## Development & Test Commands

```bash
# Start local development server (port 3000)
npm run dev

# Run TypeScript typecheck
npm run lint

# Run unit tests via Vitest
npm test

# Run Vitest in watch mode
npm run test:watch

# Run Playwright end-to-end tests
npm run test:e2e

# Production build
npm run build
```
