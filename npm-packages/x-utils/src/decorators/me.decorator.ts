import {
  createParamDecorator,
  ExecutionContext,
  ParseUUIDPipe,
} from "@nestjs/common";
import { Request } from "express";

const USER_ID_HEADER = "x-user-id";

/**
 * Get current user id
 * @usage get(@MeId(): me: string) {}
 *
 * If the user if not authenticated, then the is is undefined
 */
export const MeId = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();
    const x_user_id: string = request.headers[USER_ID_HEADER];
    return x_user_id;
  }
);
