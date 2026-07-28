export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  } | null;
}

export type ActionResult<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};
