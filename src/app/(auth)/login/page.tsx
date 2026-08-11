'use client'

import Link from "next/link";
import { Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {

  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm(state => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setFieldErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        toast.success("Вход выполнен успешно");
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        if (errorData.fieldErrors) {
          setFieldErrors(errorData.fieldErrors);
        }
        toast.error(errorData.error || "Ошибка при входе");
      }
    } catch (error) {
      toast.error("Сетевая ошибка или сервер недоступен");
    } finally {
      setIsPending(false);
    }
  }



  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <Link href="/" className="mb-8 flex items-center space-x-2 z-10">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
        </div>
        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Remote Recordings
        </span>
      </Link>

      <Card className="w-full max-w-md z-10 border-white/10 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Вход</CardTitle>
          <CardDescription>
            Введите email и пароль для доступа
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <Input id="email" name="email" onChange={handleInput} value={form.email} placeholder="admin@example.com" type="email" />
              {fieldErrors.email && (
                <p className="text-sm text-red-500 font-medium">{fieldErrors.email[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                  Пароль
                </label>
              </div>
              <Input id="password" name="password" onChange={handleInput} value={form.password} type="password" placeholder="••••••••" />
              {fieldErrors.password && (
                <p className="text-sm text-red-500 font-medium">{fieldErrors.password[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={isPending} className="w-full shadow-lg shadow-primary/20">
              {isPending ? "Вход..." : "Войти"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Link href="/register" className="text-primary hover:underline underline-offset-4">
                Создать
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div >
  );
}
