import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Server {
  id: number;
  name: string;
  players: number;
  maxPlayers: number;
  queue: number;
  map: string;
  gameMode: string;
  status: "online" | "offline" | "maintenance";
}

interface ServerConnectionStatus {
  serverId: number;
  ok: boolean;
  connectUrl?: string;
  error?: string;
}

// Initial static servers data - will be updated with RCON data
let servers: Server[] = [
  {
    id: 1,
    name: "RSGS Free",
    players: 0,
    maxPlayers: 80,
    queue: 0,
    map: "Loading...",
    gameMode: "Checking...",
    status: "maintenance",
  },
  {
    id: 2,
    name: "RSGS #1",
    players: 0,
    maxPlayers: 80,
    queue: 0,
    map: "Offline",
    gameMode: "Offline",
    status: "offline",
  },
  {
    id: 3,
    name: "RSGS Invasion",
    players: 0,
    maxPlayers: 80,
    queue: 0,
    map: "Offline",
    gameMode: "Offline",
    status: "offline",
  },
  {
    id: 4,
    name: "RSGS International",
    players: 0,
    maxPlayers: 80,
    queue: 0,
    map: "Offline",
    gameMode: "Offline",
    status: "offline",
  },
];

function getStatusColor(status: Server["status"]) {
  switch (status) {
    case "online":
      return "text-gaming-success";
    case "offline":
      return "text-gaming-error";
    case "maintenance":
      return "text-gaming-warning";
    default:
      return "text-gaming-text-muted";
  }
}

function getStatusDot(status: Server["status"]) {
  switch (status) {
    case "online":
      return "bg-gaming-success";
    case "offline":
      return "bg-gaming-error";
    case "maintenance":
      return "bg-gaming-warning";
    default:
      return "bg-gaming-text-muted";
  }
}

// Cache interface
interface CacheData {
  data: Server[];
  timestamp: number;
}

// Cache duration: 30 seconds
const CACHE_DURATION = 30 * 1000;

export default function ServerStatus() {
  const [serverData, setServerData] = useState<Server[]>(servers);
  const [connectionStatuses, setConnectionStatuses] = useState<
    Record<number, ServerConnectionStatus>
  >({});
  const [loadingConnections, setLoadingConnections] = useState<
    Record<number, boolean>
  >({});
  const [isLoadingRcon, setIsLoadingRcon] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Fetch RCON server data with caching
  useEffect(() => {
    const fetchRconData = async (forceRefresh = false) => {
      const now = Date.now();

      // Check if we have cached data and it's still valid
      if (
        !forceRefresh &&
        lastFetchTime &&
        now - lastFetchTime < CACHE_DURATION
      ) {
        console.log("Using cached server data");
        return;
      }

      setIsLoadingRcon(true);

      try {
        const response = await fetch("/api/rcon-status");
        if (response.ok) {
          const rconData = await response.json();

          // Update servers with RCON data
          const updatedServers = rconData.map((rconServer: any) => ({
            id: rconServer.serverId,
            name: `RSGS Server ${rconServer.serverId}`,
            players: rconServer.players || 0,
            maxPlayers: rconServer.maxPlayers || 80,
            queue: Math.max(
              0,
              (rconServer.players || 0) - (rconServer.maxPlayers || 80),
            ),
            map: rconServer.map || "Unknown",
            gameMode: rconServer.gameMode || "Unknown",
            status: rconServer.status as Server["status"],
          }));

          setServerData(updatedServers);
          setLastFetchTime(now);

          // Cache to localStorage
          const cacheData: CacheData = {
            data: updatedServers,
            timestamp: now,
          };
          localStorage.setItem("rcon_cache", JSON.stringify(cacheData));
        }
      } catch (error) {
        console.error("Failed to fetch RCON data:", error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные серверов",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRcon(false);
      }
    };

    // Load cached data on mount
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem("rcon_cache");
        if (cached) {
          const cacheData: CacheData = JSON.parse(cached);
          const now = Date.now();

          // Check if cached data is still valid
          if (now - cacheData.timestamp < CACHE_DURATION) {
            console.log("Loading cached server data");
            setServerData(cacheData.data);
            setLastFetchTime(cacheData.timestamp);
            setIsLoadingRcon(false);
            return true; // Data loaded from cache
          }
        }
      } catch (error) {
        console.error("Failed to load cached data:", error);
      }
      return false; // No valid cache found
    };

    const checkAllServers = async () => {
      try {
        const serverIds = serverData.map((s) => s.id);
        const response = await fetch("/api/server-status/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serverIds }),
        });

        if (response.ok) {
          const statuses: ServerConnectionStatus[] = await response.json();
          const statusMap = statuses.reduce(
            (acc, status) => {
              acc[status.serverId] = status;
              return acc;
            },
            {} as Record<number, ServerConnectionStatus>,
          );

          setConnectionStatuses(statusMap);
        }
      } catch (error) {
        console.error("Failed to check server statuses:", error);
      }
    };

    // Try to load cached data first
    const hasCachedData = loadCachedData();

    // If no cached data, fetch fresh data
    if (!hasCachedData) {
      fetchRconData();
    }

    checkAllServers();

    // Refresh server data every 45 seconds
    const interval = setInterval(() => {
      fetchRconData();
      checkAllServers();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = async (server: Server) => {
    const connectionStatus = connectionStatuses[server.id];

    if (server.status !== "online") {
      toast({
        title: "Сервер недоступен",
        description:
          "Сервер находится в оффлайне или на техническом обслуживании",
        variant: "destructive",
      });
      return;
    }

    // If we don't have connection status yet, check it
    if (!connectionStatus) {
      setLoadingConnections((prev) => ({ ...prev, [server.id]: true }));

      try {
        const response = await fetch(`/api/server-status/${server.id}`);
        const status: ServerConnectionStatus = await response.json();

        setConnectionStatuses((prev) => ({ ...prev, [server.id]: status }));

        if (status.ok && status.connectUrl) {
          window.open(status.connectUrl, "_blank");
        } else {
          toast({
            title: "Подключение недоступно",
            description: "Сервер временно недоступен для подключения",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Ошибка подключения",
          description: "Не удалось проверить статус подключения к серверу",
          variant: "destructive",
        });
      } finally {
        setLoadingConnections((prev) => ({ ...prev, [server.id]: false }));
      }
      return;
    }

    // If we have connection status, use it
    if (connectionStatus.ok && connectionStatus.connectUrl) {
      window.open(connectionStatus.connectUrl, "_blank");
    } else {
      toast({
        title: "Подключение недоступно",
        description:
          connectionStatus.error ||
          "Сервер временно недоступен для подключения",
        variant: "destructive",
      });
    }
  };

  const isConnectionAvailable = (server: Server) => {
    if (server.status !== "online") return false;

    const connectionStatus = connectionStatuses[server.id];
    return connectionStatus?.ok === true;
  };

  const getConnectButtonText = (server: Server) => {
    if (server.status !== "online") return "Недоступен";

    if (loadingConnections[server.id]) return "Проверка...";

    const connectionStatus = connectionStatuses[server.id];
    if (!connectionStatus) return "Подключиться";

    return connectionStatus.ok ? "Подключиться" : "Недоступен";
  };

  return (
    <section id="servers" className="py-12 bg-gaming-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gaming-text">
            Статус серверов
          </h2>
          {isLoadingRcon && (
            <div className="flex items-center text-gaming-accent">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gaming-accent mr-2"></div>
              <span className="text-sm">Обновление данных...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serverData.map((server) => (
            <div
              key={server.id}
              className="bg-gaming-card border border-gaming-border rounded-lg p-6 hover:bg-gaming-card-hover transition-colors"
            >
              {/* Server Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gaming-text">
                  {server.name}
                </h3>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(server.status)}`}
                  />
                  <span className={`text-sm ${getStatusColor(server.status)}`}>
                    {server.status === "online"
                      ? "Online"
                      : server.status === "offline"
                        ? "Offline"
                        : "Maintenance"}
                  </span>
                </div>
              </div>

              {/* Player Count */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gaming-text-muted text-sm">Игроки</span>
                  <span className="text-gaming-text font-semibold">
                    {server.players}/{server.maxPlayers}
                    {server.queue > 0 && (
                      <span className="text-gaming-warning ml-1">
                        (+{server.queue})
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gaming-border rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-gaming-accent"
                    style={{
                      width: `${(server.players / server.maxPlayers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Map and Game Mode */}
              <div className="space-y-2">
                <div>
                  <span className="text-gaming-text-muted text-sm">
                    Карт��:
                  </span>
                  <p className="text-gaming-text text-sm">{server.map}</p>
                </div>
                <div>
                  <span className="text-gaming-text-muted text-sm">Режим:</span>
                  <p className="text-gaming-text text-sm">{server.gameMode}</p>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={() => handleConnect(server)}
                disabled={
                  !isConnectionAvailable(server) &&
                  server.status === "online" &&
                  connectionStatuses[server.id]?.ok === false
                }
                className={`w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors ${
                  isConnectionAvailable(server)
                    ? "bg-gaming-accent hover:bg-gaming-accent-hover text-black cursor-pointer"
                    : server.status === "online" &&
                        !connectionStatuses[server.id]
                      ? "bg-gaming-accent/70 hover:bg-gaming-accent text-black cursor-pointer"
                      : "bg-gaming-border text-gaming-text-muted cursor-not-allowed"
                }`}
              >
                {getConnectButtonText(server)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
