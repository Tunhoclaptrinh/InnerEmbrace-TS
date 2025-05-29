import { apiClient } from "../services/auth.service";
import authHeader from "../services/auth-header";

// Updated interfaces to match API response
export interface Podcast {
  id: string; // UUID trong API
  title: string;
  description?: string;
  authorName: string; // Đổi từ host -> authorName theo API
  coverImage: string; // Đổi từ image -> coverImage theo API
  podcastType?: string;
  categoryId?: string; // UUID trong API
  category?: string;
  episodes?: Episode[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Episode {
  id: string; // UUID trong API
  title: string;
  description?: string;
  duration: number; // number trong API
  coverImage?: string;
  audio?: string; // URL audio file
  position: number; // Đổi từ position -> position
  playlistId?: string;
  podcastId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Playlist {
  id: string;
  podcastId: string;
  description?: string;
  duration: number;
  coverImage?: string;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PodcastCategory {
  id: string; // UUID trong API
  name: string;
  slug?: string;
  categoryType?: "PODCAST" | "BLOG";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API endpoints
const ENDPOINTS = {
  PODCAST: "/rest/v1/podcast",
  CATEGORY: "/rest/v1/categories", // Cần confirm table name
  PLAYLIST: "/rest/v1/playlist",
  EPISODE: "/rest/v1/episode",
  SUBSCRIPTION: "/rest/v1/subscriptions",
};

// ================ CATEGORY FUNCTIONS ================

export const getAllCategories = async (): Promise<{
  data: PodcastCategory[];
}> => {
  try {
    // Thử các endpoint có thể có cho categories
    const possibleEndpoints = [
      "/rest/v1/categories",
      "/rest/v1/category",
      "/rest/v1/podcast_categories",
      "/rest/v1/podcast_category",
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        const response = await apiClient.get(
          `${endpoint}?categoryType=eq.PODCAST`,
          {
            headers: authHeader(),
          }
        );
        return { data: response.data };
      } catch (err: any) {
        if (err.response?.status !== 404) {
          throw err;
        }
        continue;
      }
    }

    // Fallback categories
    console.warn("No category endpoint found, using fallback categories");
    return {
      data: [
        {
          id: "1",
          name: "Trending Podcasts",
          slug: "trending",
          categoryType: "PODCAST",
        },
        {
          id: "2",
          name: "Relax Podcasts",
          slug: "relax",
          categoryType: "PODCAST",
        },
        {
          id: "3",
          name: "Education Podcasts",
          slug: "education",
          categoryType: "PODCAST",
        },
        {
          id: "4",
          name: "Business & Technology Podcasts",
          slug: "business-tech",
          categoryType: "PODCAST",
        },
        {
          id: "5",
          name: "Lifestyle & Health Podcasts",
          slug: "lifestyle-health",
          categoryType: "PODCAST",
        },
        {
          id: "6",
          name: "Arts & Entertainment Podcasts",
          slug: "arts-entertainment",
          categoryType: "PODCAST",
        },
        {
          id: "7",
          name: "Chill vibes for Friday morning",
          slug: "chill-friday",
          categoryType: "PODCAST",
        },
      ],
    };
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories"
    );
  }
};

export const getCategoryById = async (
  categoryId: string
): Promise<{ data: PodcastCategory }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.CATEGORY}?id=eq.${categoryId}`,
      {
        headers: authHeader(),
      }
    );

    if (response.data && response.data.length > 0) {
      return { data: response.data[0] };
    } else {
      throw new Error("Category not found");
    }
  } catch (error: any) {
    console.error("Error fetching category:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch category"
    );
  }
};

export const createCategory = async (
  categoryData: Omit<PodcastCategory, "id" | "createdAt" | "updatedAt">
): Promise<{ data: PodcastCategory }> => {
  try {
    const response = await apiClient.post(ENDPOINTS.CATEGORY, categoryData, {
      headers: {
        ...authHeader(),
        Prefer: "return=representation",
      },
    });
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error creating category:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create category"
    );
  }
};

// ================ PODCAST FUNCTIONS ================

export const getAllPodcasts = async (): Promise<{ data: Podcast[] }> => {
  try {
    const response = await apiClient.get(ENDPOINTS.PODCAST, {
      headers: authHeader(),
    });
    return { data: response.data };
  } catch (error: any) {
    console.error("Error fetching podcasts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch podcasts"
    );
  }
};

export const getPodcastById = async (
  podcastId: string
): Promise<{ data: Podcast }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.PODCAST}?id=eq.${podcastId}`,
      {
        headers: authHeader(),
      }
    );

    if (response.data && response.data.length > 0) {
      return { data: response.data[0] };
    } else {
      throw new Error("Podcast not found");
    }
  } catch (error: any) {
    console.error("Error fetching podcast:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch podcast");
  }
};

export const getPodcastsByCategory = async (
  categoryId: string
): Promise<{ data: Podcast[] }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.PODCAST}?categoryId=eq.${categoryId}`,
      {
        headers: authHeader(),
      }
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error fetching podcasts by category:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch podcasts by category"
    );
  }
};

export const createPodcast = async (
  podcastData: Omit<Podcast, "id" | "createdAt" | "updatedAt">
): Promise<{ data: Podcast }> => {
  try {
    const response = await apiClient.post(ENDPOINTS.PODCAST, podcastData, {
      headers: {
        ...authHeader(),
        Prefer: "return=representation",
      },
    });
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error creating podcast:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create podcast"
    );
  }
};

export const updatePodcast = async (
  podcastId: string,
  podcastData: Partial<Podcast>
): Promise<{ data: Podcast }> => {
  try {
    const response = await apiClient.patch(
      `${ENDPOINTS.PODCAST}?id=eq.${podcastId}`,
      podcastData,
      {
        headers: {
          ...authHeader(),
          Prefer: "return=representation",
        },
      }
    );
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error updating podcast:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update podcast"
    );
  }
};

export const deletePodcast = async (podcastId: string): Promise<void> => {
  try {
    await apiClient.delete(`${ENDPOINTS.PODCAST}?id=eq.${podcastId}`, {
      headers: authHeader(),
    });
  } catch (error: any) {
    console.error("Error deleting podcast:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete podcast"
    );
  }
};

export const searchPodcasts = async (
  searchTerm: string
): Promise<{ data: Podcast[] }> => {
  try {
    const encodedTerm = encodeURIComponent(searchTerm);
    const response = await apiClient.get(
      `${ENDPOINTS.PODCAST}?or=(title.ilike.*${encodedTerm}*,authorName.ilike.*${encodedTerm}*,description.ilike.*${encodedTerm}*)`,
      {
        headers: authHeader(),
      }
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error searching podcasts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to search podcasts"
    );
  }
};

// ================ PLAYLIST FUNCTIONS ================

export const getPlaylistsByPodcast = async (
  podcastId: string
): Promise<{ data: Playlist[] }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.PLAYLIST}?podcastId=eq.${podcastId}&order=position.asc`,
      {
        headers: authHeader(),
      }
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error fetching playlists:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch playlists"
    );
  }
};

export const getPlaylistById = async (
  playlistId: string
): Promise<{ data: Playlist }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.PLAYLIST}?id=eq.${playlistId}`,
      {
        headers: authHeader(),
      }
    );

    if (response.data && response.data.length > 0) {
      return { data: response.data[0] };
    } else {
      throw new Error("Playlist not found");
    }
  } catch (error: any) {
    console.error("Error fetching playlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch playlist"
    );
  }
};

export const createPlaylist = async (
  playlistData: Omit<Playlist, "id" | "createdAt" | "updatedAt">
): Promise<{ data: Playlist }> => {
  try {
    const response = await apiClient.post(ENDPOINTS.PLAYLIST, playlistData, {
      headers: {
        ...authHeader(),
        Prefer: "return=representation",
      },
    });
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error creating playlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create playlist"
    );
  }
};

export const updatePlaylist = async (
  playlistId: string,
  playlistData: Partial<Playlist>
): Promise<{ data: Playlist }> => {
  try {
    const response = await apiClient.patch(
      `${ENDPOINTS.PLAYLIST}?id=eq.${playlistId}`,
      playlistData,
      {
        headers: {
          ...authHeader(),
          Prefer: "return=representation",
        },
      }
    );
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error updating playlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update playlist"
    );
  }
};

export const deletePlaylist = async (playlistId: string): Promise<void> => {
  try {
    await apiClient.delete(`${ENDPOINTS.PLAYLIST}?id=eq.${playlistId}`, {
      headers: authHeader(),
    });
  } catch (error: any) {
    console.error("Error deleting playlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete playlist"
    );
  }
};

// ================ EPISODE FUNCTIONS ================

export const getEpisodesByPlaylist = async (
  playlistId: string
): Promise<{ data: Episode[] }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.EPISODE}?playlistId=eq.${playlistId}&order=position.asc`,
      {
        headers: authHeader(),
      }
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error fetching episodes:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch episodes"
    );
  }
};

export const getEpisodeById = async (
  episodeId: string
): Promise<{ data: Episode }> => {
  try {
    const response = await apiClient.get(
      `${ENDPOINTS.EPISODE}?id=eq.${episodeId}`,
      {
        headers: authHeader(),
      }
    );

    if (response.data && response.data.length > 0) {
      return { data: response.data[0] };
    } else {
      throw new Error("Episode not found");
    }
  } catch (error: any) {
    console.error("Error fetching episode:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch episode");
  }
};

export const createEpisode = async (
  episodeData: Omit<Episode, "id" | "createdAt" | "updatedAt">
): Promise<{ data: Episode }> => {
  try {
    const response = await apiClient.post(ENDPOINTS.EPISODE, episodeData, {
      headers: {
        ...authHeader(),
        Prefer: "return=representation",
      },
    });
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error creating episode:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create episode"
    );
  }
};

export const updateEpisode = async (
  episodeId: string,
  episodeData: Partial<Episode>
): Promise<{ data: Episode }> => {
  try {
    const response = await apiClient.patch(
      `${ENDPOINTS.EPISODE}?id=eq.${episodeId}`,
      episodeData,
      {
        headers: {
          ...authHeader(),
          Prefer: "return=representation",
        },
      }
    );
    return { data: response.data[0] || response.data };
  } catch (error: any) {
    console.error("Error updating episode:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update episode"
    );
  }
};

export const deleteEpisode = async (episodeId: string): Promise<void> => {
  try {
    await apiClient.delete(`${ENDPOINTS.EPISODE}?id=eq.${episodeId}`, {
      headers: authHeader(),
    });
  } catch (error: any) {
    console.error("Error deleting episode:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete episode"
    );
  }
};

// ================ SUBSCRIPTION FUNCTIONS ================

export const subscribeToNotifications = async (
  userId: string
): Promise<void> => {
  try {
    await apiClient.post(
      ENDPOINTS.SUBSCRIPTION,
      { userId },
      {
        headers: authHeader(),
      }
    );
  } catch (error: any) {
    console.error("Error subscribing to notifications:", error);
    throw new Error(
      error.response?.data?.message || "Failed to subscribe to notifications"
    );
  }
};

export const unsubscribeFromNotifications = async (
  userId: string
): Promise<void> => {
  try {
    await apiClient.delete(`${ENDPOINTS.SUBSCRIPTION}?userId=eq.${userId}`, {
      headers: authHeader(),
    });
  } catch (error: any) {
    console.error("Error unsubscribing from notifications:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to unsubscribe from notifications"
    );
  }
};

// ================ FILE UPLOAD FUNCTIONS ================

export const uploadImage = async (
  file: File
): Promise<{ data: { url: string } }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      "/functions/v1/file/image",
      formData,
      {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
};

export const uploadAudio = async (
  file: File
): Promise<{ data: { url: string } }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      "/functions/v1/file/audio",
      formData,
      {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error uploading audio:", error);
    throw new Error(error.response?.data?.message || "Failed to upload audio");
  }
};

// ================ UTILITY FUNCTIONS ================

export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    await apiClient.get(`/rest/v1/${tableName}?limit=1`, {
      headers: authHeader(),
    });
    return true;
  } catch (error: any) {
    return error.response?.status !== 404;
  }
};

// Compatibility functions với interface cũ
export const getPodcastCategories = getAllCategories;
export const getPodcastEpisodes = getEpisodesByPlaylist;
