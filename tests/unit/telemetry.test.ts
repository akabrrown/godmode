import { describe, it, expect } from 'vitest';
import { TelemetryManager } from '../../src/telemetry/intent.js';

describe('TelemetryManager (TDD Red -> Green)', () => {
  it('should declare tool intent and track it in running state', () => {
    const telemetry = new TelemetryManager();
    const intent = telemetry.declareIntent({
      callId: 'call_123',
      toolName: 'workspace_edit',
      intent: 'Adding Stripe webhook verification middleware',
      costTier: 'LOW',
    });

    expect(intent.callId).toBe('call_123');
    expect(intent.status).toBe('RUNNING');
    expect(intent.intent).toBe('Adding Stripe webhook verification middleware');
    expect(intent.startTime).toBeGreaterThan(0);
  });

  it('should resolve tool outcome and record duration', () => {
    const telemetry = new TelemetryManager();
    telemetry.declareIntent({
      callId: 'call_456',
      toolName: 'test_runner',
      intent: 'Running Vitest suite',
      costTier: 'LOW',
    });

    const outcome = telemetry.resolveOutcome('call_456', {
      outcome: 'All 15 tests passed',
      status: 'SUCCESS',
    });

    expect(outcome.callId).toBe('call_456');
    expect(outcome.status).toBe('SUCCESS');
    expect(outcome.outcome).toBe('All 15 tests passed');
    expect(outcome.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should notify subscribers of live intent and outcome events', () => {
    const telemetry = new TelemetryManager();
    const events: string[] = [];

    telemetry.subscribe((event) => {
      events.push(`${event.type}:${event.callId}`);
    });

    telemetry.declareIntent({
      callId: 'call_789',
      toolName: 'build',
      intent: 'Compiling TypeScript bundle',
      costTier: 'LOW',
    });

    telemetry.resolveOutcome('call_789', {
      outcome: 'Build succeeded in 240ms',
      status: 'SUCCESS',
    });

    expect(events).toEqual(['intent:call_789', 'outcome:call_789']);
  });
});
