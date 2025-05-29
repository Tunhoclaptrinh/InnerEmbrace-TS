import { apiClient } from "./auth.service";
import authHeader from "./auth-header";

// ===== INTERFACES =====
export interface Category {
  id: string;
  name: string;
  slug: string;
  categoryType: "BLOG" | "PODCAST";
  createdAt?: string;
  updatedAt?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  blogType: string;
  categoryId: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface BlogListResponse {
  data: Blog[];
  total: number;
  page: number;
  totalPages: number;
}

// ===== UTILITY FUNCTIONS =====
const handleError = (error: unknown, message: string, fallbackReturn?: any) => {
  console.error(message, error);

  if (error instanceof Error) {
    console.error("Error details:", error.message);
  }

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as any;
    console.error("Response data:", axiosError.response?.data);
    console.error("Response status:", axiosError.response?.status);

    if (axiosError.response?.status === 401) {
      throw new Error("Authentication required");
    } else if (axiosError.response?.status === 403) {
      throw new Error("Access forbidden");
    } else if (axiosError.response?.status === 404) {
      throw new Error("Resource not found");
    }
  }

  if (fallbackReturn !== undefined) {
    return fallbackReturn;
  }

  throw new Error(message);
};

const buildPaginatedResponse = <T>(
  data: T[],
  headers: any,
  page: number,
  limit: number
) => {
  let total = 0;
  const contentRange = headers["content-range"];
  if (contentRange) {
    const match = contentRange.match(/(\d+)-(\d+)\/(\d+)|(\*)\/(\d+)/);
    if (match) {
      total = parseInt(match[3] || match[5], 10);
    }
  } else {
    total = data?.length || 0;
  }

  const totalPages = Math.ceil(total / limit);

  return {
    data: data || [],
    total,
    page,
    totalPages,
  };
};

// ===== CATEGORY SERVICES =====
export const getCategories = async (
  type?: "BLOG" | "PODCAST"
): Promise<Category[]> => {
  try {
    let url = "/rest/v1/category?select=*";
    if (type) {
      url += `&categoryType=eq.${type}`;
    }

    console.log("Fetching categories from:", url);
    const response = await apiClient.get(url, {
      headers: authHeader(),
    });
    console.log("Category response:", response.data);
    return response.data || [];
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryById = async (
  categoryId: string
): Promise<Category | null> => {
  try {
    const response = await apiClient.get(
      `/rest/v1/category?id=eq.${categoryId}`,
      {
        headers: authHeader(),
      }
    );
    return response.data?.[0] || null;
  } catch (error: unknown) {
    console.error("Error fetching category:", error);
    return null;
  }
};

//   categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
// ): Promise<Category> => {
//   try {
//     const response = await apiClient.post("/rest/v1/category", categoryData, {
//       headers: {
//         ...authHeader(),
//         Prefer: "return=representation",
//       },
//     });
//     return response.data[0];
//   } catch (error: unknown) {
//     handleError(error, "Error creating category");
//     throw error;
//   }
// };

// export const updateCategory = async (
//   categoryId: string,
//   categoryData: Partial<Category>
// ): Promise<Category> => {
//   try {
//     const response = await apiClient.patch(
//       `/rest/v1/category?id=eq.${categoryId}`,
//       categoryData,
//       {
//         headers: {
//           ...authHeader(),
//           Prefer: "return=representation",
//         },
//       }
//     );
//     return response.data[0];
//   } catch (error: unknown) {
//     handleError(error, "Error updating category");
//     throw error;
//   }
// };

// export const deleteCategory = async (categoryId: string): Promise<void> => {
//   try {
//     await apiClient.delete(`/rest/v1/category?id=eq.${categoryId}`, {
//       headers: authHeader(),
//     });
//   } catch (error: unknown) {
//     handleError(error, "Error deleting category");
//   }
// };

// ===== BLOG SERVICES =====
export const getBlogs = async (params?: {
  categoryId?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<BlogListResponse> => {
  try {
    let url = "/rest/v1/blog?select=*,category:categoryId(*)";
    const queryParams: string[] = [];

    if (params?.categoryId) {
      queryParams.push(`categoryId=eq.${params.categoryId}`);
    }

    if (params?.search && params.search.trim()) {
      const searchTerm = params.search.trim();
      queryParams.push(
        `or=(title.ilike.*${searchTerm}*,content.ilike.*${searchTerm}*)`
      );
    }

    queryParams.push("order=createdAt.desc");

    if (queryParams.length > 0) {
      url += "&" + queryParams.join("&");
    }

    console.log("Fetching blogs from:", url);

    const limit = params?.limit || 12;
    const page = params?.page || 1;
    const offset = (page - 1) * limit;
    const rangeEnd = offset + limit - 1;

    const response = await apiClient.get(url, {
      headers: {
        ...authHeader(),
        Range: `${offset}-${rangeEnd}`,
        Prefer: "count=exact",
      },
    });

    console.log("Blogs response:", response.data);
    console.log("Response headers:", response.headers);

    return buildPaginatedResponse(response.data, response.headers, page, limit);
  } catch (error: unknown) {
    console.error("Error fetching blogs:", error);

    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 416) {
        return {
          data: [],
          total: 0,
          page: params?.page || 1,
          totalPages: 0,
        };
      }
    }

    return {
      data: [],
      total: 0,
      page: params?.page || 1,
      totalPages: 0,
    };
  }
};

export const getBlogById = async (blogId: string): Promise<Blog | null> => {
  try {
    if (!blogId || blogId.trim() === "") {
      throw new Error("Blog ID is required");
    }

    console.log("Fetching blog by ID:", blogId);
    const response = await apiClient.get(
      `/rest/v1/blog?id=eq.${blogId}&select=*,category:categoryId(*)`,
      {
        headers: authHeader(),
      }
    );

    console.log("Blog by ID response:", response.data);

    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error("Blog not found");
    }
  } catch (error: unknown) {
    console.error("Error fetching blog:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch blog");
  }
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    if (!slug || slug.trim() === "") {
      throw new Error("Blog slug is required");
    }

    const response = await apiClient.get(
      `/rest/v1/blog?slug=eq.${slug}&select=*,category:categoryId(*)`,
      {
        headers: authHeader(),
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      return null;
    }
  } catch (error: unknown) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
};

export const getLatestBlogs = async (limit: number = 4): Promise<Blog[]> => {
  try {
    console.log("Fetching latest blogs with limit:", limit);
    const response = await apiClient.get(
      `/rest/v1/blog?select=*,category:categoryId(*)&limit=${limit}&order=createdAt.desc`,
      {
        headers: authHeader(),
      }
    );
    console.log("Latest blogs response:", response.data);
    return response.data || [];
  } catch (error: unknown) {
    console.error("Error fetching latest blogs:", error);
    return [];
  }
};

export const getRelatedBlogs = async (
  blogId: string,
  categoryId: string,
  limit: number = 3
): Promise<Blog[]> => {
  try {
    if (!blogId || !categoryId) {
      return [];
    }

    const response = await apiClient.get(
      `/rest/v1/blog?categoryId=eq.${categoryId}&id=neq.${blogId}&select=*,category:categoryId(*)&limit=${limit}&order=createdAt.desc`,
      {
        headers: authHeader(),
      }
    );
    return response.data || [];
  } catch (error: unknown) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
};

export const createBlog = async (
  blogData: Omit<Blog, "id" | "createdAt" | "updatedAt">
): Promise<Blog> => {
  try {
    const response = await apiClient.post("/rest/v1/blog", blogData, {
      headers: {
        ...authHeader(),
        Prefer: "return=representation",
      },
    });
    return response.data[0];
  } catch (error: unknown) {
    handleError(error, "Error creating blog");
    throw error;
  }
};

export const updateBlog = async (
  blogId: string,
  blogData: Partial<Blog>
): Promise<Blog> => {
  try {
    const response = await apiClient.patch(
      `/rest/v1/blog?id=eq.${blogId}`,
      blogData,
      {
        headers: {
          ...authHeader(),
          Prefer: "return=representation",
        },
      }
    );
    return response.data[0];
  } catch (error: unknown) {
    handleError(error, "Error updating blog");
    throw error;
  }
};

export const deleteBlog = async (blogId: string): Promise<void> => {
  try {
    await apiClient.delete(`/rest/v1/blog?id=eq.${blogId}`, {
      headers: authHeader(),
    });
  } catch (error: unknown) {
    handleError(error, "Error deleting blog");
  }
};

export const getBlogCount = async (params?: {
  categoryId?: string;
  search?: string;
}): Promise<number> => {
  try {
    let url = "/rest/v1/blog?select=count";
    const queryParams: string[] = [];

    if (params?.categoryId) {
      queryParams.push(`categoryId=eq.${params.categoryId}`);
    }

    if (params?.search && params.search.trim()) {
      const searchTerm = params.search.trim();
      queryParams.push(
        `or=(title.ilike.*${searchTerm}*,content.ilike.*${searchTerm}*)`
      );
    }

    if (queryParams.length > 0) {
      url += "&" + queryParams.join("&");
    }

    const response = await apiClient.get(url, {
      headers: {
        ...authHeader(),
        Prefer: "count=exact",
      },
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0].count || 0;
    }

    const contentRange = response.headers["content-range"];
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) {
        return parseInt(match[1], 10);
      }
    }

    return 0;
  } catch (error: unknown) {
    console.error("Error fetching blog count:", error);
    return 0;
  }
};
