export type CostTier = 'LOW' | 'MEDIUM' | 'HIGH';
export type ToolStatus = 'RUNNING' | 'SUCCESS' | 'FAILED' | 'BLOCKED';

export interface IntentDeclaration {
  callId: string;
  toolName: string;
  intent: string;
  provider?: string;
  model?: string;
  costTier?: CostTier;
}

export interface ActiveCallRecord extends IntentDeclaration {
  status: 'RUNNING';
  startTime: number;
}

export interface OutcomeResolution {
  outcome: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  error?: string;
  artifactsCreated?: string[];
}

export interface CompletedCallRecord {
  callId: string;
  toolName: string;
  intent: string;
  outcome: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  durationMs: number;
  error?: string;
  artifactsCreated?: string[];
}

export type TelemetryEvent =
  | { type: 'intent'; callId: string; data: ActiveCallRecord }
  | { type: 'outcome'; callId: string; data: CompletedCallRecord };

export type TelemetrySubscriber = (event: TelemetryEvent) => void;

export class TelemetryManager {
  private activeCalls: Map<string, ActiveCallRecord> = new Map();
  private completedCalls: Map<string, CompletedCallRecord> = new Map();
  private subscribers: Set<TelemetrySubscriber> = new Set();

  /**
   * Broadcasts and records a tool intent declaration.
   */
  declareIntent(declaration: IntentDeclaration): ActiveCallRecord {
    const record: ActiveCallRecord = {
      ...declaration,
      costTier: declaration.costTier || 'LOW',
      status: 'RUNNING',
      startTime: Date.now(),
    };

    this.activeCalls.set(declaration.callId, record);
    this.notify({ type: 'intent', callId: declaration.callId, data: record });
    return record;
  }

  /**
   * Resolves a tool call into an outcome and measures latency.
   */
  resolveOutcome(callId: string, resolution: OutcomeResolution): CompletedCallRecord {
    const active = this.activeCalls.get(callId);
    const durationMs = active ? Date.now() - active.startTime : 0;

    const completed: CompletedCallRecord = {
      callId,
      toolName: active?.toolName || 'unknown',
      intent: active?.intent || '',
      outcome: resolution.outcome,
      status: resolution.status,
      durationMs,
      error: resolution.error,
      artifactsCreated: resolution.artifactsCreated,
    };

    this.activeCalls.delete(callId);
    this.completedCalls.set(callId, completed);
    this.notify({ type: 'outcome', callId, data: completed });

    return completed;
  }

  /**
   * Subscribes to real-time telemetry streaming events.
   */
  subscribe(subscriber: TelemetrySubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  private notify(event: TelemetryEvent): void {
    for (const sub of this.subscribers) {
      try {
        sub(event);
      } catch {
        // Prevent subscriber errors from disrupting telemetry
      }
    }
  }

  getActiveCalls(): ActiveCallRecord[] {
    return Array.from(this.activeCalls.values());
  }

  getCompletedCalls(): CompletedCallRecord[] {
    return Array.from(this.completedCalls.values());
  }
}
