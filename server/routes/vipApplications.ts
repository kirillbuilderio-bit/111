import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import FormData from "form-data";

// Discord webhook URL
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1408854118579310666/kOnjEKa5Ikq6xuPTmuNOqbzeWjia6Ti6VLPENfJcDkTIpWzzhISLh5EYI9vq1DV_mOkZ";

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/vip-screenshots";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `vip-${timestamp}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Только изображения разрешены!"));
    }
  },
});

// Send Discord webhook notification
async function sendDiscordWebhook(applicationData: any) {
  try {
    // Prepare screenshot URL for webhook
    const baseUrl = process.env.BASE_URL || "http://localhost:8080";
    const screenshotUrl = applicationData.screenshot
      ? `${baseUrl}/uploads/vip-screenshots/${applicationData.screenshot.filename}`
      : null;

    console.log("Sending Discord webhook with screenshot URL:", screenshotUrl);

    const embed = {
      title: "🎯 Новая заявка на VIP статус",
      color: 16766720, // Gold color
      fields: [
        {
          name: "📋 План VIP",
          value: `**${applicationData.plan.name}**\n💰 ${applicationData.plan.price}\n⏰ ${applicationData.plan.duration}`,
          inline: true,
        },
        {
          name: "🎮 Данные игрока",
          value: `**Steam ID:** \`${applicationData.steamId}\`\n**Discord ID:** ${applicationData.discordId || "Не указан"}`,
          inline: true,
        },
        {
          name: "💳 Способ оплаты",
          value:
            applicationData.paymentMethod === "tbank"
              ? "🏛️ Т-Банк"
              : "💳 СБП (Т-Банк)",
          inline: true,
        },
        {
          name: "💬 Комментарий",
          value: applicationData.comment || "Не указан",
          inline: false,
        },
        {
          name: "📅 Время подачи",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false,
        },
      ],
      footer: {
        text: "RSGS VIP Applications System",
        icon_url: "https://example.com/rsgs-logo.png",
      },
      timestamp: new Date().toISOString(),
    };

    // Add screenshot field if available
    if (screenshotUrl) {
      embed.fields.push({
        name: "📸 Скриншот оплаты",
        value: `✅ Скриншот приложен`,
        inline: false,
      });

      // Set as thumbnail
      embed.thumbnail = {
        url: screenshotUrl,
      };
    }

    let webhookPayload;
    let headers;
    let body;

    // Try to send with file attachment if screenshot exists
    if (
      applicationData.screenshot &&
      fs.existsSync(applicationData.screenshot.path)
    ) {
      try {
        const form = new FormData();

        form.append(
          "payload_json",
          JSON.stringify({
            content: "👋 @here Новая заявка на VIP!",
            embeds: [embed],
          }),
        );

        form.append(
          "file",
          fs.createReadStream(applicationData.screenshot.path),
          {
            filename: applicationData.screenshot.filename,
            contentType: "image/png",
          },
        );

        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          body: form,
          headers: form.getHeaders(),
        });

        if (!response.ok) {
          console.error(
            "Discord webhook with file failed:",
            response.status,
            response.statusText,
          );
          throw new Error("File upload failed");
        } else {
          console.log("Discord webhook with file sent successfully");
          return;
        }
      } catch (fileError) {
        console.error(
          "File attachment failed, falling back to embed:",
          fileError,
        );
      }
    }

    // Fallback to regular webhook without file
    webhookPayload = {
      content: "👋 @here Новая заявка на VIP!",
      embeds: [embed],
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      console.error(
        "Discord webhook failed:",
        response.status,
        response.statusText,
      );
    } else {
      console.log("Discord webhook sent successfully");
    }
  } catch (error) {
    console.error("Error sending Discord webhook:", error);
  }
}

// Handle VIP application submission
export const handleVipApplication: RequestHandler = async (req, res) => {
  try {
    const { steamId, discordId, comment, plan, paymentMethod } = req.body;
    const screenshot = req.file;

    if (!steamId || !screenshot || !plan) {
      return res.status(400).json({
        error: "Steam ID, скриншот и план VIP обязательны",
      });
    }

    // Parse plan data
    let planData;
    try {
      planData = JSON.parse(plan);
    } catch (error) {
      return res.status(400).json({
        error: "Неверный формат данных плана",
      });
    }

    // Create application data
    const applicationData = {
      id: Date.now(),
      steamId,
      discordId: discordId || "",
      comment: comment || "",
      plan: planData,
      paymentMethod: paymentMethod || "tbank",
      screenshot: {
        filename: screenshot.filename,
        originalname: screenshot.originalname,
        path: screenshot.path,
        size: screenshot.size,
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save application to file (in production, use database)
    const applicationsFile = "data/vip-applications.json";
    let applications = [];

    try {
      if (fs.existsSync(applicationsFile)) {
        const data = fs.readFileSync(applicationsFile, "utf8");
        applications = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading applications file:", error);
    }

    applications.push(applicationData);

    // Ensure data directory exists
    const dataDir = path.dirname(applicationsFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));

    // Send Discord webhook notification
    await sendDiscordWebhook(applicationData);

    res.json({
      success: true,
      message: "Заявка на VIP статус успешно отправлена",
      applicationId: applicationData.id,
    });
  } catch (error) {
    console.error("Error processing VIP application:", error);
    res.status(500).json({
      error: "Внутренняя ошибка сервера",
    });
  }
};

// Get all VIP applications (for admin)
export const getVipApplications: RequestHandler = (req, res) => {
  try {
    const applicationsFile = "data/vip-applications.json";

    if (!fs.existsSync(applicationsFile)) {
      return res.json([]);
    }

    const data = fs.readFileSync(applicationsFile, "utf8");
    const applications = JSON.parse(data);

    // Sort by creation date (newest first)
    applications.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json(applications);
  } catch (error) {
    console.error("Error getting VIP applications:", error);
    res.status(500).json({
      error: "Ошибка получения заявок",
    });
  }
};

// Update VIP application status (for admin)
export const updateVipApplicationStatus: RequestHandler = (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminNote } = req.body;

    const applicationsFile = "data/vip-applications.json";

    if (!fs.existsSync(applicationsFile)) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }

    const data = fs.readFileSync(applicationsFile, "utf8");
    const applications = JSON.parse(data);

    const applicationIndex = applications.findIndex(
      (app: any) => app.id === parseInt(applicationId),
    );

    if (applicationIndex === -1) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }

    applications[applicationIndex].status = status;
    applications[applicationIndex].adminNote = adminNote || "";
    applications[applicationIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));

    res.json({
      success: true,
      message: "Статус зая��ки обновлен",
    });
  } catch (error) {
    console.error("Error updating VIP application:", error);
    res.status(500).json({
      error: "Ошибка обновления заявки",
    });
  }
};

export const uploadMiddleware = upload.single("screenshot");
