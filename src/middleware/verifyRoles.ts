import { NextFunction, Request, Response } from "express"

const verifyRoles = (...allowedRoles: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if(!request.roles) return response.sendStatus(401);
    const roles = [...allowedRoles];
    
    const hasRole = request.roles.some(role => roles.includes(role));
    if(!hasRole) return response.sendStatus(403);
    next();
  }
}

export default verifyRoles;