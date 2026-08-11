import { Settings, User, Bell, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAuth } from "@/features/auth/utils/requireAuth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/features/users/components/ProfileForm";
import { logout } from "@/features/auth/actions/logout";

export default async function SettingsPage() {
  const session = await requireAuth();
  if (!session || !session.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { name: true, email: true }
  });

  if (!user) {
    redirect("/login");
  }

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
          <CardContent>
            <ProfileForm user={user} />
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
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 transition-colors">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">PWA Установка</div>
                <div className="text-xs text-muted-foreground">Установить приложение на главный экран</div>
              </div>
              <Button variant="outline" size="sm" className="cursor-pointer">Установить</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 transition-colors">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Тёмная тема</div>
                <div className="text-xs text-muted-foreground">Включена по умолчанию</div>
              </div>
              <Badge variant="success">Активно</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card className="border-destructive/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-destructive/5 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="w-5 h-5 mr-2" />
              Опасная зона
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            <p className="text-sm text-muted-foreground">
              Действия в этом разделе не могут быть отменены.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <form action={logout} className="w-full sm:w-auto">
                <Button variant="destructive" type="submit" className="w-full cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти со всех устройств
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
