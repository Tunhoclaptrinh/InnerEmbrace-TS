import axios from "axios";

const URL = process.env.REACT_APP_SUPABASE_URL || "";
const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY || "";

export const apiClient = axios.create({
  baseURL: URL,
  headers: {
    apikey: API_KEY || "",
    "Content-Type": "application/json",
  },
});

export const register = (
  email: string,
  password: string,
  fullname: string,
  avatar_url: string = "https://placehold.co/60x60?text=avatar"
) => {
  return apiClient.post("/auth/v1/signup", {
    email,
    password,
    data: {
      fullname,
      avatar_url,
    },
  });
};

export const login = (email: string, password: string) => {
  return apiClient
    .post("/auth/v1/token?grant_type=password", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access_token) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
          })
        );
      }
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const refreshToken = async () => {
  const user = getCurrentUser();
  if (!user?.refreshToken) return null;

  try {
    const response = await apiClient.post(
      "/auth/v1/token?grant_type=refresh_token",
      {
        refresh_token: user.refreshToken,
      }
    );

    if (response.data.access_token) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
        })
      );
    }

    return response.data;
  } catch (error) {
    return null;
  }
};
