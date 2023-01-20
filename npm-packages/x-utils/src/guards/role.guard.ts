import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../types/roles.enum";

export const ROLES_REFLECT_KEY = "roles";
export const Roles = (...roles: Role[]) =>
  SetMetadata(ROLES_REFLECT_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  private static USER_ROLES_HEADER = "x-user-roles";
  private readonly logger = new Logger(this.constructor.name);

  constructor(@Inject(Reflector.name) private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_REFLECT_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const path = this.getRoutePath(context);
    const roles = this.getRolesFromHeaders(context);
    const hasRoles = this.hasRoles(roles, requiredRoles);
    this.logger.debug(
      "[" +
        path +
        "]" +
        "Expected roles [" +
        requiredRoles +
        "], given roles [" +
        roles +
        "], authorized: " +
        hasRoles
    );

    if (!hasRoles) {
      this.logger.warn("[" + path + "] Route not authorized to user");
    }
    return hasRoles;
  }

  getRoutePath(context: ExecutionContext): string {
    return context.switchToHttp().getRequest().route.path;
  }

  getRolesFromHeaders(context: ExecutionContext): Role[] {
    const header_content = this.fetchRoleHeader(context);

    if (!header_content) {
      return [];
    }

    return this.parseRoles(header_content);
  }

  fetchRoleHeader(context: ExecutionContext): string {
    try {
      return context.switchToHttp().getRequest().headers[
        RolesGuard.USER_ROLES_HEADER
      ];
    } catch (e) {
      return "";
    }
  }

  parseRoles(roles_str: string): Role[] {
    const roles_str_list = roles_str.split(",");
    const roles = [];
    for (let i = 0; i < roles_str_list.length; i++) {
      const e = roles_str_list[i];
      switch (e) {
        case "MEMBER":
          roles.push(Role.Member);
          break;
        case "CONTRIBUTOR":
          roles.push(Role.Contributor);
          break;
        case "ADMINISTRATOR":
          roles.push(Role.Admin);
          break;
      }
    }

    return roles;
  }

  hasRoles(roles: Role[], expected_roles: Role[]): boolean {
    return Boolean(roles.some((role) => expected_roles.includes(role)));
  }
}
