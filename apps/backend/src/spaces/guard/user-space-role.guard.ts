import { Role } from "./../enum/roles.enum";
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SpacesService } from "../spaces.service";

@Injectable()
export class UserInSpaceWithRoleGuard implements CanActivate {
  constructor(
    private readonly spaceService: SpacesService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role: Role =
      this.reflector.get<Role>("role", context.getHandler()) || "user";

    const request = context.switchToHttp().getRequest();
    const spaceSlug = request.params?.slug;
    const user = request?.user;

    if (!spaceSlug || !user) {
      throw new Error(
        "Space slug and/or user was not found on the request params"
      );
    }

    const space = await this.spaceService.getUserSpace(user.id, spaceSlug);

    const userRoleInSpace = await this.spaceService.getRoleInSpace(
      user.id,
      spaceSlug
    );

    if (!isOk(userRoleInSpace, role)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

function isOk(role: Role, requiredRole: Role) {
  if (requiredRole === "admin") return role === requiredRole;
  return true;
}
