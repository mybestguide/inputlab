import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from './test-utils';
import { Button } from '../components/ui/button';
import { Card, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MetricCard } from '../components/ui/metric-card';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { cn } from '../lib/utils';
import { colors, spacing, radius } from '../styles/tokens';

describe('Design Tokens & Utilities', () => {
  it('cn merges Tailwind classes correctly without collision', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6');
    expect(cn('text-red-500', undefined, 'font-bold')).toBe('text-red-500 font-bold');
  });

  it('provides structured metrology color tokens for both light and dark themes', () => {
    expect(colors.light.surfaceCanvas).toBe('#F8FAFC');
    expect(colors.dark.surfaceCanvas).toBe('#0B0F17');
    expect(colors.light.statusPass).toBe('#059669');
    expect(colors.dark.statusPass).toBe('#34D399');
  });

  it('defines mathematical spacing scale adhering to 4px intervals', () => {
    expect(spacing[1]).toBe('0.25rem');
    expect(spacing[4]).toBe('1rem');
    expect(radius.xl).toBe('1rem');
  });
});

describe('Base Layout Primitives', () => {
  it('renders Button with proper variant and size classes', () => {
    render(<Button variant="primary">Actuate</Button>);
    const button = screen.getByRole('button', { name: /actuate/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('bg-sky-600');
  });

  it('renders Card with header and content', () => {
    render(
      <Card>
        <CardTitle>Optical Sensor Bench</CardTitle>
        <CardContent>Telemetry Stream Ready</CardContent>
      </Card>
    );
    expect(screen.getByText('Optical Sensor Bench')).toBeInTheDocument();
    expect(screen.getByText('Telemetry Stream Ready')).toBeInTheDocument();
  });

  it('renders Badge with diagnostic pass variant', () => {
    render(<Badge variant="pass">NKRO VERIFIED</Badge>);
    expect(screen.getByText('NKRO VERIFIED')).toBeInTheDocument();
  });

  it('renders MetricCard with formatted tabular numeric value and unit', () => {
    render(<MetricCard label="Polling Rate" value="1000" unit="Hz" subtext="USB HID standard" />);
    expect(screen.getByText('Polling Rate')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('Hz')).toBeInTheDocument();
  });
});

describe('ErrorBoundary Fault Tolerance', () => {
  it('catches render errors and renders diagnostic fault screen instead of crashing', () => {
    const FaultyComponent = () => {
      throw new Error('Sensor telemetry disconnected');
    };

    // Suppress expected console.error during this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <FaultyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Diagnostic Subsystem Fault')).toBeInTheDocument();
    expect(screen.getByText(/Sensor telemetry disconnected/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
