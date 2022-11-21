import { RolesGuard } from "./role.guard";
import { Reflector } from "@nestjs/core";
import { Role } from "../types/roles.enum";

describe("RoleGuard", () => {
    test("parseRoles can parse a single role", () => {
        const guard = new RolesGuard(new Reflector())

        const tested_roles = [
            ["ADMINISTRATOR", Role.Admin],
            ["CONTRIBUTOR", Role.Contributor],
            ["MEMBER", Role.Member],
        ]

        for (let i = 0; i < tested_roles.length; i++) {
            const given_role = tested_roles[i][0]
            const expected_role = tested_roles[i][1]
            const parsed_role = guard.parseRoles(given_role)
            expect(parsed_role).toHaveLength(1)
            expect(parsed_role).toStrictEqual([expected_role])
        }
    })

    test("parseRoles can parse a several roles", () => {
        const guard = new RolesGuard(new Reflector())

        const tested_roles = [
            ["ADMINISTRATOR,MEMBER,CONTRIBUTOR", [Role.Admin, Role.Contributor, Role.Member]],
            ["CONTRIBUTOR,MEMBER", [Role.Contributor, Role.Member]],
        ]

        for (let i = 0; i < tested_roles.length; i++) {
            const given_roles = tested_roles[i][0] as string
            const expected_roles = tested_roles[i][1] as Role[]
            const parsed_role = guard.parseRoles(given_roles)
            expect(parsed_role).toHaveLength(expected_roles.length)
            expect(parsed_role.sort()).toEqual(expected_roles.sort())
        }
    })

    test("hasRoles allows single role among an array of all roles", () => {
        const guard = new RolesGuard(new Reflector())
        const given_roles = [Role.Member]
        const expected_roles = [Role.Admin, Role.Contributor, Role.Member]
        expect(guard.hasRoles(given_roles, expected_roles)).toBeTruthy()
    })

    test("hasRoles forbids contributor among an array of admin role", () => {
        const guard = new RolesGuard(new Reflector())
        const given_roles = [Role.Contributor]
        const expected_roles = [Role.Admin]
        expect(guard.hasRoles(given_roles, expected_roles)).toBeFalsy()
    })
})
