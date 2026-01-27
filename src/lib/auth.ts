const AUTH_KEY = "mutola_auth";

export const AUTH_CREDENTIALS = {
  username: "mk",
  password: "mk123",
} as const;

export const checkAuth = (username: string, password: string): boolean =>
  username === AUTH_CREDENTIALS.username && password === AUTH_CREDENTIALS.password;

export const isAuthenticated = (): boolean => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as { user: string; at: number };
    // Session 7 kun amal qiladi
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    return data?.user === AUTH_CREDENTIALS.username && Date.now() - (data?.at ?? 0) < maxAge;
  } catch {
    return false;
  }
};

export const setAuthenticated = (): void => {
  try {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ user: AUTH_CREDENTIALS.username, at: Date.now() })
    );
  } catch (e) {
    console.error("Auth saqlashda xatolik:", e);
  }
};

export const logout = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
};
