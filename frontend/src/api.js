const API = import.meta.env.VITE_API || "http://localhost:4000";

export function getToken() {
  return localStorage.getItem("token") || "";
}
export function setToken(t) {
  if (t) localStorage.setItem("token", t);
  else localStorage.removeItem("token");
}

async function req(path, { method="GET", body } = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(()=> ({}));
  if(!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const api = {
  login: (username,password) => req("/api/admin/login", {method:"POST", body:{username,password}}),

  // exercises
  listExercises: (params={}) => {
    const qs = new URLSearchParams(params).toString();
    return req(`/api/exercises${qs ? `?${qs}` : ""}`);
  },
  createExercise: (payload) => req("/api/exercises", {method:"POST", body: payload}),
  updateExercise: (id,payload) => req(`/api/exercises/${id}`, {method:"PUT", body: payload}),
  deleteExercise: (id) => req(`/api/exercises/${id}`, {method:"DELETE"}),

  // members
  listMembers: (params={}) => {
    const qs = new URLSearchParams(params).toString();
    return req(`/api/members${qs ? `?${qs}` : ""}`);
  },
  createMember: (payload) => req("/api/members", {method:"POST", body: payload}),
  updateMember: (id,payload) => req(`/api/members/${id}`, {method:"PUT", body: payload}),
  deleteMember: (id) => req(`/api/members/${id}`, {method:"DELETE"}),

  // subscriptions
  listSubscriptions: (params={}) => {
    const qs = new URLSearchParams(params).toString();
    return req(`/api/subscriptions${qs ? `?${qs}` : ""}`);
  },
  createSubscription: (payload) => req("/api/subscriptions", {method:"POST", body: payload}),
  updateSubscription: (id,payload) => req(`/api/subscriptions/${id}`, {method:"PUT", body: payload}),
  deleteSubscription: (id) => req(`/api/subscriptions/${id}`, {method:"DELETE"}),
};
