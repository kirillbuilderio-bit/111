import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const authToken = localStorage.getItem('admin_auth');
    if (authToken) {
      // Verify token is still valid
      verifyToken(authToken);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_auth');
      }
    } catch (error) {
      localStorage.removeItem('admin_auth');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast({
        title: "Введите пароль",
        description: "Пароль обязателен для входа в админ панель",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_auth', data.token);
        setIsAuthenticated(true);
        toast({
          title: "Добро пожаловать!",
          description: "Вы успешно вошли в админ панель",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Ош��бка входа",
          description: errorData.error || "Неверный пароль",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword("");
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из админ панели",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
        <Card className="w-full max-w-md bg-gaming-card border-gaming-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gaming-accent/20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-gaming-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gaming-text">
              Админ панель
            </CardTitle>
            <p className="text-gaming-text-muted">
              Введите пароль для доступа к панели управления
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gaming-text">
                  Пароль
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gaming-bg border-gaming-border text-gaming-text pr-10"
                    placeholder="Введите админ пароль"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-text-muted hover:text-gaming-text"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-black"
                disabled={loading}
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admin panel with logout option
  return (
    <div className="min-h-screen bg-gaming-bg">
      <div className="bg-gaming-card border-b border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Lock className="w-6 h-6 text-gaming-accent mr-2" />
              <h1 className="text-lg font-semibold text-gaming-text">
                Админ панель
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gaming-border text-gaming-text hover:bg-gaming-bg"
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
