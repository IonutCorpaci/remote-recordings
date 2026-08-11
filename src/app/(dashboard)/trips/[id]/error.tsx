"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 min-h-[50vh]">
      <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
      <h2 className="text-xl font-semibold">Что-то пошло не так!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Не удалось загрузить данные поездки. Возможно, она была удалена или у вас нет доступа.
      </p>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => reset()} variant="outline">
          Попробовать снова
        </Button>
        <Button asChild>
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  );
}
