"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.can = can;
function can(user, permission) {
    if (!user)
        return false;
    if (user.isAdmin)
        return true;
    if (user.permissions?.includes("*:*"))
        return true;
    return Boolean(user.permissions?.includes(permission));
}
