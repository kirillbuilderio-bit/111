import { RequestHandler } from "express";

export interface ServerStatusResponse {
  serverId: number;
  ok: boolean;
  connectUrl?: string;
  error?: string;
}

// Check server connection status via RGS API
export const checkServerStatus: RequestHandler = async (req, res) => {
  const serverId = parseInt(req.params.serverId);

  if (!serverId || isNaN(serverId)) {
    return res.status(400).json({
      error: "Invalid server ID",
    });
  }

  try {
    // Call the RGS Squad API to check server status
    const response = await fetch(`https://rgs-squad.ru/c/check?s=${serverId}`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    const result: ServerStatusResponse = {
      serverId,
      ok: data.ok || false,
    };

    // If server is available, provide connect URL
    if (result.ok) {
      result.connectUrl = `https://rgs-squad.ru/c/?s=${serverId}`;
    }

    res.json(result);
  } catch (error) {
    console.error(`Failed to check server ${serverId} status:`, error);

    res.json({
      serverId,
      ok: false,
      error: "Failed to check server status",
    } as ServerStatusResponse);
  }
};

// Check multiple servers at once
export const checkMultipleServers: RequestHandler = async (req, res) => {
  const { serverIds } = req.body;

  if (!Array.isArray(serverIds) || serverIds.length === 0) {
    return res.status(400).json({
      error: "serverIds must be a non-empty array",
    });
  }

  try {
    // Check all servers in parallel
    const statusPromises = serverIds.map(async (serverId: number) => {
      try {
        const response = await fetch(
          `https://rgs-squad.ru/c/check?s=${serverId}`,
        );
        const data = await response.json();

        return {
          serverId,
          ok: data.ok || false,
          connectUrl: data.ok
            ? `https://rgs-squad.ru/c/?s=${serverId}`
            : undefined,
        } as ServerStatusResponse;
      } catch (error) {
        return {
          serverId,
          ok: false,
          error: "Failed to check server status",
        } as ServerStatusResponse;
      }
    });

    const results = await Promise.all(statusPromises);
    res.json(results);
  } catch (error) {
    console.error("Failed to check multiple servers:", error);
    res.status(500).json({
      error: "Failed to check server statuses",
    });
  }
};
