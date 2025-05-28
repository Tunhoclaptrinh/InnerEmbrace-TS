export default function authHeader() {
  const API_KEY = process.env.REACT_APP_SUPABASE_API_KEY || "";
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) user = JSON.parse(userStr);

  if (user && user.accessToken) {
    return {
      Authorization: `Bearer ${user.accessToken}`,
      apikey: API_KEY,
    };
  } else {
    return {
      Authorization: "",
      apikey: API_KEY,
    };
  }
}
