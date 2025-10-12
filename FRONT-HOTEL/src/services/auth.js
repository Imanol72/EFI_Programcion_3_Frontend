import api, { logAxiosError } from "./api";

const login = async ({ username, password }) => {
  try {
    const res = await api.post("/auth/login", { username, password });
    return res.data; // { token, user }
  } catch (err) { logAxiosError(err, "Auth: login"); }
};



const register = async ({ username, password }) => {
  try {
    const res = await api.post("/auth/register", { username, password });
    return res.data;
  } catch (err) { logAxiosError(err, "Auth: register"); }
};

// ⚠️ Solo dejalos si TENÉS estos endpoints en el backend.
// Si no existen, comentá/quitá estas funciones:
const forgotPassword = async (email) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  } catch (err) { logAxiosError(err, "Auth: forgotPassword"); }
};

const resetPassword = async (token, newPassword) => {
  try {
    const res = await api.post("/auth/reset-password", { token, password: newPassword });
    return res.data;
  } catch (err) { logAxiosError(err, "Auth: resetPassword"); }
};

export default { login, register, forgotPassword, resetPassword };
