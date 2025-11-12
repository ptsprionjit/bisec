// auth/permissions.js
import { TYPE_OFFICE_ROLE, USER_PERMISSION } from "./roles";

export const hasPermission = (type, office, role, permission) => {
    const validUser = TYPE_OFFICE_ROLE[type][office][role] || null;
    if (validUser) {
        return USER_PERMISSION[permission];
    }
};