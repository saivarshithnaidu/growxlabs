import { Logger } from "../observability/logger";

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeoutMs?: number;
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private nextAttempt = Date.now();
  private failureThreshold: number;
  private resetTimeoutMs: number;

  constructor(private serviceName: string, options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeoutMs = options.resetTimeoutMs || 10000;
  }

  async execute<T>(action: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttempt) {
        this.state = "HALF_OPEN";
        Logger.info(`Circuit Breaker for ${this.serviceName} entering HALF_OPEN state.`);
      } else {
        Logger.warn(`Circuit Breaker for ${this.serviceName} is OPEN. Executing fallback.`);
        return fallback();
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (error: any) {
      this.onFailure(error);
      return fallback();
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure(error: any) {
    this.failureCount++;
    Logger.error(`Circuit Breaker ${this.serviceName} failure (${this.failureCount}/${this.failureThreshold}): ${error.message}`);

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.resetTimeoutMs;
      Logger.warn(`Circuit Breaker for ${this.serviceName} tripped to OPEN.`);
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}
