import { NextResponse } from "next/server";

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    requestId: string;
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiResponse {
  static success<T>(
    data: T,
    meta: { page?: number; limit?: number; total?: number; totalPages?: number } = {},
    status = 200,
    requestId?: string
  ): NextResponse<ApiResponseEnvelope<T>> {
    const reqId = requestId || "req_" + Math.random().toString(36).substring(2, 10);
    const body: ApiResponseEnvelope<T> = {
      success: true,
      data,
      meta: {
        ...meta,
        requestId: reqId,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(body, {
      status,
      headers: {
        "x-request-id": reqId,
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "strict-transport-security": "max-age=31536000; includeSubDomains"
      }
    });
  }

  static error(
    message: string,
    code = "BAD_REQUEST",
    status = 400,
    details?: any,
    requestId?: string
  ): NextResponse<ApiResponseEnvelope<null>> {
    const reqId = requestId || "req_" + Math.random().toString(36).substring(2, 10);
    const body: ApiResponseEnvelope<null> = {
      success: false,
      error: {
        code,
        message,
        details
      },
      meta: {
        requestId: reqId,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(body, {
      status,
      headers: {
        "x-request-id": reqId,
        "x-content-type-options": "nosniff"
      }
    });
  }
}
