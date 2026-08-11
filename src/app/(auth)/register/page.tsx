'use client'

import Link from "next/link";
import { Car, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

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

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        router.push('/')

      } else {
        const errorData = await response.json();
        console.error("Ошибка от сервера:", errorData.error);
      }
    } catch (error) {
      console.error("Сетевая ошибка:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/4 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

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
          <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          <CardDescription>
            Создайте аккаунт администратора
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Имя
              </label>
              <Input id="name" name="name" onChange={handleInput} value={form.name} placeholder="Иван Иванов" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input id="email" name="email" onChange={handleInput} value={form.email} placeholder="admin@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Пароль
              </label>
              <Input id="password" name="password" onChange={handleInput} value={form.password} type="password" placeholder="••••••••" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full shadow-lg shadow-primary/20">
              Создать аккаунт
              <UserPlus className="w-4 h-4 ml-2" />
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="text-primary hover:underline underline-offset-4">
                Войти
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
