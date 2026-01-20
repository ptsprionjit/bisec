export const ROLES = {
    ADMIN: "admin",
    BOARD: "board",
    OFFICE: "office",
    USER: "user",
};

export const hasRole = (user, allowedRoles = []) => {
    if (!user?.role) return false;
    return allowedRoles.includes(user.role);
};
