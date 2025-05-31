import {z} from "zod/v4"

export default interface ErrorResponse {
  message: string | undefined;
  issues?: z.core.$ZodIssue[];
  stack?: string;
}