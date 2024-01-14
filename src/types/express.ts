import { Query, Send } from "express-serve-static-core";
import { Request, Response } from "express";

export interface TypedRequest<Q extends Query = any, B = any> extends Request {
  body: B;
  query: Q;
}

export interface TypedResponse<ResBody = ApiResponse> extends Response {
  json: Send<ResBody, this>;
  send: Send<ResBody, this>;
}

interface ApiResponse<T = Object> {
  status: "success" | "error";
  message: string;
  data: T | null;
}
