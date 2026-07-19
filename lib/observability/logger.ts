// Structured JSON Logger with PII Masking

export interface LogMeta {
  requestId?: string;
  userId?: string;
  module?: string;
  [key: string]: any;
}

export class Logger {
  private static maskPII(data: Record<string, any>): Record<string, any> {
    const masked = { ...data };
    const piiFields = ["password", "token", "secret", "credit_card", "ssn", "pan_number"];

    Object.keys(masked).forEach((key) => {
      if (piiFields.includes(key.toLowerCase())) {
        masked[key] = "******";
      }
    });

    return masked;
  }

  static info(message: string, meta: LogMeta = {}) {
    const logObj = {
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      ...this.maskPII(meta)
    };
    console.log(JSON.stringify(logObj));
  }

  static warn(message: string, meta: LogMeta = {}) {
    const logObj = {
      level: "WARN",
      timestamp: new Date().toISOString(),
      message,
      ...this.maskPII(meta)
    };
    console.warn(JSON.stringify(logObj));
  }

  static error(message: string, meta: LogMeta = {}) {
    const logObj = {
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
      ...this.maskPII(meta)
    };
    console.error(JSON.stringify(logObj));
  }
}
