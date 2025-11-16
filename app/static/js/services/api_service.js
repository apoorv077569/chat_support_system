import { BASE_URL } from "../config.js";

export async function apiGet(endpoint, token = null) {
    try {
        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        };
        const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, ...errorData };
        }
        return await res.json();
    } catch (err) {
        return { success: false, error: `Error due to ${err.message}` };
    }
}

export async function apiPost(endpoint, data, token = null) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: `Error due to ${err.message}` };
  }
}

