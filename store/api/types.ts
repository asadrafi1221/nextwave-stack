export interface IAPIResponse<T = unknown> {
  /** ✅ True if operation succeeded */
  success: boolean;

  /** 📦 Optional data returned when success is true */
  data?: T;

  /** ⚠️ Optional standardized error structure */
  error?: {
    message: string;
    code?: string;
  };

  /** 🌐 Optional HTTP-like status code */
  status?: string;
}
