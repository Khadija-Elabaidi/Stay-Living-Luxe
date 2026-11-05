export const isAdminUser = (user) => {
  if (!user) return false;

  const directRole = String(user.role || "").toUpperCase();
  if (directRole === "ADMIN" || directRole === "ROLE_ADMIN") return true;

  if (Array.isArray(user.authorities)) {
    return user.authorities.some((auth) => {
      const roleStr = String(auth?.authority || auth || "").toUpperCase();
      return roleStr === "ADMIN" || roleStr === "ROLE_ADMIN";
    });
  }
  return false;
};

export const getHomePathForUser = (user) =>
  isAdminUser(user) ? "/admin" : "/client";