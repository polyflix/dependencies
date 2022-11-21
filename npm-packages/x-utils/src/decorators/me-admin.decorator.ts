import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

const USER_ROLE_HEADER = "x-user-roles";

/**
 * Return true is the user is an admin
 * @usage get(@IsAdmin(): isAdmin: boolean) {}
 *
 */
export const IsAdmin = createParamDecorator(
  (data: string, ctx: ExecutionContext): boolean => {
    const request: Request = ctx.switchToHttp().getRequest();
    const x_user_roles: string = request.headers[USER_ROLE_HEADER];
    const roles = x_user_roles ? x_user_roles.split(",") : [];
    return roles.findIndex((role) => role === "ADMINISTRATOR") !== -1;
  }
);
