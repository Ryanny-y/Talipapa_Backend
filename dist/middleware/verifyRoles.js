"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyRoles = (...allowedRoles) => {
    return (request, response, next) => {
        if (!request.roles)
            return response.sendStatus(401);
        const roles = [...allowedRoles];
        const hasRole = request.roles.some(role => roles.includes(role));
        if (!hasRole)
            return response.sendStatus(403);
        next();
    };
};
exports.default = verifyRoles;
