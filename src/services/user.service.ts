import { apiClient } from "./auth.service";
import authHeader from "./auth-header";

// Content related services
export const getPublicContent = async () => {
  try {
    const response = await apiClient.get("/rest/v1/public");
    return { data: response.data };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch public content"
    );
  }
};

export const getUserBoard = async () => {
  try {
    const response = await apiClient.get("/rest/v1/user-content", {
      headers: authHeader(),
    });
    return { data: response.data };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch user content"
    );
  }
};

export const getModeratorBoard = async () => {
  try {
    const response = await apiClient.get("/rest/v1/mod-content", {
      headers: authHeader(),
    });
    return { data: response.data };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch moderator content"
    );
  }
};

export const getAdminBoard = async () => {
  try {
    const response = await apiClient.get("/rest/v1/admin-content", {
      headers: authHeader(),
    });
    return { data: response.data };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch admin content"
    );
  }
};

// User profile services
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/auth/v1/user", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch user profile"
    );
  }
};

export const updateUserProfile = async (userData: {
  fullname?: string;
  avatar?: string;
}) => {
  try {
    const response = await apiClient.patch(
      "/auth/v1/user",
      { data: userData },
      { headers: authHeader() }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update profile");
  }
};

// Session services
export const getSessions = async () => {
  try {
    const response = await apiClient.get("/rest/v1/session", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    try {
      const fallbackResponse = await apiClient.get("/functions/v1/session");
      return fallbackResponse.data;
    } catch (fallbackError: any) {
      throw new Error(
        fallbackError.response?.data?.error || "Failed to fetch sessions"
      );
    }
  }
};

export const getSessionMessages = async (sessionId: string) => {
  try {
    const response = await apiClient.get(
      `/rest/v1/message?sessionId=eq.${sessionId}&limit=10&order=createdAt.desc`,
      { headers: authHeader() }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch messages");
  }
};

export const getStreak = async () => {
  try {
    const response = await apiClient.get("/functions/v1/streak");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch streak");
  }
};
