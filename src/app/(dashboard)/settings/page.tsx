import { Settings, User, Bell, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground mt-1">Управление аккаунтом и приложением</p>
      </div>

      <div className="space-y-6">
        {/* Профиль */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Профиль администратора
            </CardTitle>
            <CardDescription>Изменить личные данные</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <Input defaultValue="Admin" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="admin@example.com" type="email" />
              </div>
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        {/* Уведомления и система */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-500" />
              Настройки приложения
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/50">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">PWA Установка</div>
                <div className="text-xs text-muted-foreground">Установить приложение на главный экран</div>
              </div>
              <Button variant="outline" size="sm">Установить</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-background/50">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Тёмная тема</div>
                <div className="text-xs text-muted-foreground">Включена по умолчанию</div>
              </div>
              <Badge variant="success">Активно</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="w-5 h-5 mr-2" />
              Опасная зона
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Действия в этом разделе не могут быть отменены.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive">
                Сменить пароль
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти со всех устройств
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
