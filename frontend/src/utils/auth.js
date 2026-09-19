export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin' || user?.email === "eslamzain8897@gmail.com";
};

export const isVendor = () => {
  return getUser()?.role === "vendor";
};

export const hasDashboardAccess = () => {
  return isAdmin() || isVendor();
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
};
