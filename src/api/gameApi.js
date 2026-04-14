import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
  timeout: 10000,
});

export const searchGames = (keyword) =>
  api.get("/api/games/search", { params: { q: keyword } }).then((r) => r.data);

export const getGame = (appId) =>
  api.get(`/api/games/${appId}`).then((r) => r.data);

export const getGamePrices = (appId) =>
  api.get(`/api/games/${appId}/prices`).then((r) => r.data);

export const getRecommendations = (likedAppIds) =>
  api
    .get("/api/games/recommend", { params: { likedAppIds: likedAppIds.join(",") } })
    .then((r) => r.data);

export const getPlatformPrices = (appId) =>
  api.get(`/api/games/${appId}/platform-prices`).then((r) => r.data);

export const getItadHistory = (appId) =>
  api.get(`/api/games/${appId}/itad-history`).then((r) => r.data);

export const getStats = () =>
  api.get("/api/games/admin/stats").then((r) => r.data);

export const getPopularGames = () =>
  api.get("/api/games/popular").then((r) => r.data);

export const getOnSaleGames = () =>
  api.get("/api/games/on-sale").then((r) => r.data);

export const registerAlert = (appId, targetPrice, email) =>
  api
    .post(`/api/games/${appId}/alert`, null, { params: { targetPrice, email } })
    .then((r) => r.data);
