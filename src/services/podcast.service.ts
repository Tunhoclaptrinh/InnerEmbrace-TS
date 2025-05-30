import { apiClient } from "./auth.service";
import authHeader from "./auth-header";

export interface Podcast {
  id: string; // UUID in API
  title: string;
  description?: string;
  authorName: string; // Changed from host to match API
  coverImage: string; // Changed from image to match API
  podcastType?: string;
  categoryId?: string; // UUID in API
  category?: string;
  episodes?: Episode[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Episode {
  id: string; // UUID in API
  title: string;
  description?: string;
  duration: number; // number in API
  coverImage?: string;
  audio?: string; // URL audio file
  position: number; // Fixed typo from position
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
  position: number; // Fixed typo from position
  createdAt?: string;
  updatedAt?: string;
}

export interface PodcastCategory {
  id: string; // UUID in API
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
  // CATEGORY: "/rest/v1/categories",
  PLAYLIST: "/rest/v1/playlist",
  EPISODE: "/rest/v1/episode",
  SUBSCRIPTION: "/rest/v1/subscriptions",
};

// ================ CATEGORY FUNCTIONS ================

export const getAllCategories = async (): Promise<{
  data: PodcastCategory[];
}> => {
  try {
    // Try different possible endpoints for categories
    const possibleEndpoints = [
      // "/rest/v1/categories",
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

    // Fallback categories if no endpoint works
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

    // Return fallback categories on any error
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

    // Return sample data if API fails
    return {
      data: [
        {
          id: "sample-1",
          title: "Sample Podcast 1",
          description: "A sample podcast for demonstration",
          authorName: "Sample Host 1",
          coverImage: "",
          categoryId: "1",
        },
        {
          id: "sample-2",
          title: "Sample Podcast 2",
          description: "Another sample podcast",
          authorName: "Sample Host 2",
          coverImage: "",
          categoryId: "2",
        },
        {
          id: "sample-3",
          title: "Sample Podcast 3",
          description: "Yet another sample podcast",
          authorName: "Sample Host 3",
          coverImage: "",
          categoryId: "3",
        },
        {
          id: "sample-4",
          title: "Sample Podcast 4",
          description: "Final sample podcast",
          authorName: "Sample Host 4",
          coverImage: "",
          categoryId: "1",
        },
      ],
    };
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
    return { data: [] }; // Return empty array instead of throwing
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
    return { data: [] }; // Return empty array instead of throwing
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
    return { data: [] };
  }
};

export const createPlaylist = async (playlist: {
  podcastId: string;
  description?: string;
  duration: number;
  coverImage?: string;
  position: number;
}): Promise<{ data: Playlist }> => {
  try {
    const response = await apiClient.post(ENDPOINTS.PLAYLIST, playlist, {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });
    return { data: response.data[0] };
  } catch (error: any) {
    console.error("Error creating playlist:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create playlist"
    );
  }
};

export const updatePlaylist = async (
  playlistId: string,
  updates: Partial<Playlist>
): Promise<{ data: Playlist }> => {
  try {
    const response = await apiClient.patch(
      `${ENDPOINTS.PLAYLIST}?id=eq.${playlistId}`,
      updates,
      {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      }
    );
    return { data: response.data[0] };
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
    return { data: [] };
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

export const createEpisode = async (episode: {
  playlistId: string;
  title: string;
  description?: string;
  duration: number;
  coverImage?: string;
  audio?: string;
  position: number;
}): Promise<{ data: Episode }> => {
  try {
    const response = await apiClient.post(ENDPOINTS.EPISODE, episode, {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    });
    return { data: response.data[0] };
  } catch (error: any) {
    console.error("Error creating episode:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create episode"
    );
  }
};

export const updateEpisode = async (
  episodeId: string,
  updates: Partial<Episode>
): Promise<{ data: Episode }> => {
  try {
    const response = await apiClient.patch(
      `${ENDPOINTS.EPISODE}?id=eq.${episodeId}`,
      updates,
      {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
      }
    );
    return { data: response.data[0] };
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

export const getPodcastCategories = getAllCategories;

// FIXED: For episodes by podcast - get all episodes from all playlists
export const getPodcastEpisodes = async (
  podcastId: string
): Promise<{ data: Episode[] }> => {
  try {
    console.log(`Fetching episodes for podcast: ${podcastId}`);

    // First get playlists for this podcast
    const playlistsResult = await getPlaylistsByPodcast(podcastId);
    console.log(`Found ${playlistsResult.data.length} playlists`);

    if (playlistsResult.data.length === 0) {
      console.log("No playlists found, returning empty episodes array");
      return { data: [] };
    }

    // Get episodes from all playlists
    const episodePromises = playlistsResult.data.map(async (playlist) => {
      console.log(`Fetching episodes for playlist: ${playlist.id}`);
      return await getEpisodesByPlaylist(playlist.id);
    });

    const episodeResults = await Promise.all(episodePromises);

    // Flatten all episodes and sort by position
    const allEpisodes = episodeResults.reduce((acc, result) => {
      return [...acc, ...result.data];
    }, [] as Episode[]);

    // Sort episodes by position within each playlist
    allEpisodes.sort((a, b) => (a.position || 0) - (b.position || 0));

    console.log(`Total episodes found: ${allEpisodes.length}`);
    return { data: allEpisodes };
  } catch (error: any) {
    console.error("Error fetching podcast episodes:", error);
    return { data: [] };
  }
};

// FIXED: Direct episode query for podcast (alternative approach)
export const getEpisodesByPodcast = async (
  podcastId: string
): Promise<{ data: Episode[] }> => {
  try {
    // Try direct query first (if podcastId is stored in episodes)
    const response = await apiClient.get(
      `${ENDPOINTS.EPISODE}?podcastId=eq.${podcastId}&order=position.asc`,
      {
        headers: authHeader(),
      }
    );

    if (response.data && response.data.length > 0) {
      return { data: response.data };
    }

    // Fallback to playlist-based approach
    return await getPodcastEpisodes(podcastId);
  } catch (error: any) {
    console.error(
      "Error fetching episodes by podcast, trying playlist approach:",
      error
    );
    // Fallback to playlist-based approach
    return await getPodcastEpisodes(podcastId);
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

// ================ ENHANCED AUDIO PLAYER FUNCTIONS ================

// Audio player instance management
let currentAudioPlayer: HTMLAudioElement | null = null;
let currentEpisode: Episode | null = null;
let audioPlayerCallbacks: {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onError?: (error: string) => void;
} = {};

export const initializeAudioPlayer = (
  callbacks?: typeof audioPlayerCallbacks
) => {
  if (callbacks) {
    audioPlayerCallbacks = callbacks;
  }

  // Remove existing player if any
  if (currentAudioPlayer) {
    currentAudioPlayer.pause();
    currentAudioPlayer.src = "";
    currentAudioPlayer.load();
  }

  // Create new audio element
  currentAudioPlayer = new Audio();
  currentAudioPlayer.preload = "metadata";

  // Add event listeners
  currentAudioPlayer.addEventListener("play", () => {
    console.log("Audio started playing");
    audioPlayerCallbacks.onPlay?.();
  });

  currentAudioPlayer.addEventListener("pause", () => {
    console.log("Audio paused");
    audioPlayerCallbacks.onPause?.();
  });

  currentAudioPlayer.addEventListener("ended", () => {
    console.log("Audio ended");
    audioPlayerCallbacks.onEnded?.();
  });

  currentAudioPlayer.addEventListener("timeupdate", () => {
    if (currentAudioPlayer) {
      audioPlayerCallbacks.onTimeUpdate?.(
        currentAudioPlayer.currentTime,
        currentAudioPlayer.duration || 0
      );
    }
  });

  currentAudioPlayer.addEventListener("error", (e) => {
    console.error("Audio error:", e);
    audioPlayerCallbacks.onError?.("Failed to load audio");
  });

  currentAudioPlayer.addEventListener("loadstart", () => {
    console.log("Started loading audio");
  });

  currentAudioPlayer.addEventListener("loadedmetadata", () => {
    console.log("Audio metadata loaded");
  });

  currentAudioPlayer.addEventListener("canplay", () => {
    console.log("Audio can start playing");
  });
};

export const playEpisode = async (episode: Episode): Promise<void> => {
  try {
    if (!episode.audio) {
      throw new Error("No audio URL provided for this episode");
    }

    console.log(`Playing episode: ${episode.title}`);
    console.log(`Audio URL: ${episode.audio}`);

    // Initialize player if not exists
    if (!currentAudioPlayer) {
      initializeAudioPlayer();
    }

    // Set current episode
    currentEpisode = episode;

    // Set audio source
    if (currentAudioPlayer) {
      currentAudioPlayer.src = episode.audio;
      currentAudioPlayer.load();

      // Attempt to play
      try {
        await currentAudioPlayer.play();
        console.log("Audio started playing successfully");
      } catch (playError: any) {
        console.error("Error playing audio:", playError);

        // Handle autoplay restrictions
        if (playError.name === "NotAllowedError") {
          audioPlayerCallbacks.onError?.(
            "Please click to enable audio playback - autoplay is blocked"
          );
        } else if (playError.name === "NotSupportedError") {
          audioPlayerCallbacks.onError?.("Audio format not supported");
        } else {
          audioPlayerCallbacks.onError?.(
            `Failed to play audio: ${playError.message}`
          );
        }
        throw playError;
      }
    }
  } catch (error: any) {
    console.error("Error playing episode:", error);
    audioPlayerCallbacks.onError?.(error.message);
    throw new Error(`Failed to play episode: ${error.message}`);
  }
};

export const pauseEpisode = (): void => {
  if (currentAudioPlayer && !currentAudioPlayer.paused) {
    currentAudioPlayer.pause();
    console.log("Audio paused");
  }
};

export const resumeEpisode = (): void => {
  if (currentAudioPlayer && currentAudioPlayer.paused) {
    currentAudioPlayer.play().catch((error) => {
      console.error("Error resuming audio:", error);
      audioPlayerCallbacks.onError?.(
        `Failed to resume audio: ${error.message}`
      );
    });
  }
};

export const stopEpisode = (): void => {
  if (currentAudioPlayer) {
    currentAudioPlayer.pause();
    currentAudioPlayer.currentTime = 0;
    console.log("Audio stopped");
  }
};

export const getCurrentPlaybackTime = (): number => {
  return currentAudioPlayer ? currentAudioPlayer.currentTime : 0;
};

export const setPlaybackTime = (time: number): void => {
  if (currentAudioPlayer) {
    currentAudioPlayer.currentTime = Math.max(
      0,
      Math.min(time, currentAudioPlayer.duration || 0)
    );
  }
};

export const getAudioDuration = (): number => {
  return currentAudioPlayer ? currentAudioPlayer.duration || 0 : 0;
};

export const isPlaying = (): boolean => {
  return currentAudioPlayer ? !currentAudioPlayer.paused : false;
};

export const getCurrentEpisode = (): Episode | null => {
  return currentEpisode;
};

export const setVolume = (volume: number): void => {
  if (currentAudioPlayer) {
    currentAudioPlayer.volume = Math.max(0, Math.min(1, volume));
  }
};

export const getVolume = (): number => {
  return currentAudioPlayer ? currentAudioPlayer.volume : 1;
};

export const togglePlayPause = (): void => {
  if (currentAudioPlayer) {
    if (currentAudioPlayer.paused) {
      resumeEpisode();
    } else {
      pauseEpisode();
    }
  }
};

// Clean up audio player
export const destroyAudioPlayer = (): void => {
  if (currentAudioPlayer) {
    currentAudioPlayer.pause();
    currentAudioPlayer.src = "";
    currentAudioPlayer.load();
    currentAudioPlayer = null;
    currentEpisode = null;
    console.log("Audio player destroyed");
  }
};
