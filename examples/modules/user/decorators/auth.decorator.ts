import { SetMetadata, UseGuards, applyDecorators } from '@/index'
import { RoleGuard } from '../guards/role.guard'
enum Role {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}
export function Auth(...roles: Role[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RoleGuard))
}
