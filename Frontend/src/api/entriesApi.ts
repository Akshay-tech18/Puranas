// // src/api/entriesApi.ts
// import api from "./axiosInstance";

// // 🔹 Create a new entry
// export const createEntry = (formData: FormData) =>
//   api.post("/entries", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // 🔹 Get a single entry
// export const getEntryById = (id: string) =>
//   api.get(`/entries/${id}`);

// // 🔹 Update an existing entry
// export const updateEntry = (id: string, formData: FormData) =>
//   api.put(`/entries/${id}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// // 🔹 Delete entry (optional)
// export const deleteEntry = (id: string) => api.delete(`/entries/${id}`);

import api from "./axiosInstance";

// ✅ Create a new entry
export const createEntry = async (formData: FormData, token: string) => {
  return await api.post("/entries", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Get a specific entry by ID
export const getEntryById = async (id: string, token: string) => {
  return await api.get(`/entries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ Update an existing entry
export const updateEntry = async (id: string, formData: FormData, token: string) => {
  return await api.put(`/entries/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Fetch all entries for the current user
export const getAllEntries = async (token: string) => {
  return await api.get("/entries", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

