import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Role } from "../types";

const USER_ROLE_HEADER = "x-user-roles";

/**
 * Get current user's roles
 * @usage get(@MeRoles(): roles: Role[]) {}
 * @usage get(@MeRoles("Admin"): roles: Role[]) {}
 *
 * If the user if not authenticated, then @returns an empty array
 */
export const MeRoles = createParamDecorator(
    (data: string, ctx: ExecutionContext): Role[] | [] => {
        const request: Request = ctx.switchToHttp().getRequest();
        let x_user_roles: string = request.headers[USER_ROLE_HEADER] as string;
        if (data) {
            x_user_roles = x_user_roles[data];
        }
        return (x_user_roles ? x_user_roles.split(",") : []).map(
            (r) => r as Role
        );
    }
);
