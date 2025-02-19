 // Esto es un Guard porque implementa el metodo CanActivate, este tiene que retornar:
 // boolean | Promise<boolean> | Observable<boolean>  // Vasicamente retorna un booleano.
 // Si es true sigue la aplicacion. falce retorna 403 Forbidden

import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity' 
import { META_ROLES } from '../decorators/role-protected.decorator';
// //import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate { 
  
  constructor(
    private readonly reflector: Reflector   // Reflector: Esto ya viene en el guard, es lo que obtiene los datos del setMetadata
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    // ejemplo es el que agregamos la metadata con el decorador de nest @setMetadata. 
    //const validRolesTest: string[] = this.reflector.get( 'rolesTest' , context.getHandler() ) // Reflector: asi accedems a la metadata que pasamos en el decorador pers.
    //console.log(validRolesTest)
        
    // Para lo de acontinuacion la metadata fua agregada con el decorador personalizado @RoleProtected.
    const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler() ) // Obtenemos los roles.
    //console.log(validRoles)

    // Las siguiente 2 validaciones es para que si no vienen los rolos cuando llamamos al guard es porque no lo necesita asique los dejamos pasar.
    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    
    const req = context.switchToHttp().getRequest();  // Obtenemos el usuario desde el contecto
    //const user: User = req.user;
    const user = req.user as User;  // Esto es lo parecido a la anterior pero asi lo hace sin instentar inferir el dato que que podemos no tener el valor en req.user.

    if ( !user ) 
      throw new BadRequestException('User not found (request)');   // Si obtenemos este error es porque tenemos un error en el backend porque llego hasta aqui sin autorizar un token.
    
    //console.log(validRoles)
    //console.log(user.roles)

    for (const role of user.roles ) {
      if ( validRoles.includes( role ) ) {
        return true;
      }
    }
    
    throw new ForbiddenException(
      `User ${ user.fullName } need a valid role: [${ validRoles }]`
    );

    // Podemos retornar solo falce y esto retornaria 403 Forbidden o una exepcion como en este caso explicando el acceso.

  }
}