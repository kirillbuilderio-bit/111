import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getRules,
  updateRules,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getTerms,
  updateTerms,
} from "./routes/content";
import {
  checkServerStatus,
  checkMultipleServers,
} from "./routes/serverStatus";
import {
  checkRconServerStatus,
  checkAllRconServers,
  getServerList,
} from "./routes/rconStatus";
import {
  handleVipApplication,
  getVipApplications,
  updateVipApplicationStatus,
  uploadMiddleware,
} from "./routes/vipApplications";
import {
  adminLogin,
  verifyAdmin,
  requireAdmin,
  getAdminInfo,
} from "./routes/adminAuth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Content Management API routes
  // News routes (public read, admin write)
  app.get("/api/news", getNews);
  app.get("/api/news/:id", getNewsById);
  app.post("/api/news", requireAdmin, createNews);
  app.put("/api/news/:id", requireAdmin, updateNews);
  app.delete("/api/news/:id", requireAdmin, deleteNews);

  // Rules routes (public read, admin write)
  app.get("/api/rules", getRules);
  app.put("/api/rules", requireAdmin, updateRules);

  // Privacy policy routes (public read, admin write)
  app.get("/api/privacy", getPrivacyPolicy);
  app.put("/api/privacy", requireAdmin, updatePrivacyPolicy);

  // Terms routes (public read, admin write)
  app.get("/api/terms", getTerms);
  app.put("/api/terms", requireAdmin, updateTerms);

  // Server status routes
  app.get("/api/server-status/:serverId", checkServerStatus);
  app.post("/api/server-status/batch", checkMultipleServers);

  // RCON status routes
  app.get("/api/rcon-status/:serverId", checkRconServerStatus);
  app.get("/api/rcon-status", checkAllRconServers);
  app.get("/api/servers", getServerList);

  // VIP applications routes
  app.post("/api/vip-applications", uploadMiddleware, handleVipApplication);
  app.get("/api/vip-applications", requireAdmin, getVipApplications);
  app.put("/api/vip-applications/:applicationId", requireAdmin, updateVipApplicationStatus);

  // Admin authentication routes
  app.post("/api/admin/login", adminLogin);
  app.get("/api/admin/verify", verifyAdmin);
  app.get("/api/admin/info", requireAdmin, getAdminInfo);

  return app;
}
