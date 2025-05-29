import { apiClient } from "./auth.service";
import authHeader from "./auth-header";

export interface SubscriptionData {
  userId: string;
  email?: string;
}

// Đăng ký nhận thông báo
export const subscribeNewsletter = async (userId: string, email?: string) => {
  try {
    const headers = authHeader();
    const response = await apiClient.post(
      "/rest/v1/subscriptions",
      {
        userId,
        email,
      },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
};

// Hủy đăng ký nhận thông báo
export const unsubscribeNewsletter = async (userId: string) => {
  try {
    const headers = authHeader();
    const response = await apiClient.delete(
      `/rest/v1/subscriptions?userId=eq.${userId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    throw error;
  }
};

// Kiểm tra trạng thái đăng ký
export const checkSubscriptionStatus = async (userId: string) => {
  try {
    const headers = authHeader();
    const response = await apiClient.get(
      `/rest/v1/subscriptions?userId=eq.${userId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw error;
  }
};
