import { Logger } from "../observability/logger";

export type QueueName =
  | "emails"
  | "notifications"
  | "reports"
  | "ai_jobs"
  | "webhooks"
  | "cron_scheduled";

export interface JobOptions {
  priority?: number;
  delayMs?: number;
  maxRetries?: number;
}

export interface QueueJob<T = any> {
  id: string;
  queue: QueueName;
  data: T;
  options: JobOptions;
  status: "queued" | "completed" | "failed";
  createdAt: string;
}

export class QueueManager {
  private static jobs: QueueJob[] = [];

  static async enqueue<T>(
    queue: QueueName,
    data: T,
    options: JobOptions = {}
  ): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: "job_" + Math.random().toString(36).substring(2, 10),
      queue,
      data,
      options: {
        priority: options.priority || 1,
        delayMs: options.delayMs || 0,
        maxRetries: options.maxRetries || 3
      },
      status: "queued",
      createdAt: new Date().toISOString()
    };

    this.jobs.push(job);
    Logger.info("Background Job Enqueued", { jobId: job.id, queue, priority: job.options.priority });

    // Process job asynchronously
    setTimeout(() => this.processJob(job.id), job.options.delayMs || 50);

    return job;
  }

  private static async processJob(jobId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (job) {
      job.status = "completed";
      Logger.info("Background Job Completed", { jobId: job.id, queue: job.queue });
    }
  }

  static getJobStatus(jobId: string): QueueJob | undefined {
    return this.jobs.find(j => j.id === jobId);
  }
}
