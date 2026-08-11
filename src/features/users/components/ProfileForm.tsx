"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateProfile, ProfileState } from "../actions/updateProfile";
import { toast } from "sonner";
import { User } from "lucide-react";

const initialState: ProfileState = {
  error: "",
  message: "",
  success: false,
};

export function ProfileForm({ user }: { user: { name: string; email: string } }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Имя</label>
          <Input name="name" defaultValue={user.name} disabled={isPending} />
          {state.fieldErrors?.name && (
            <p className="text-red-500 text-xs font-medium">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input name="email" type="email" defaultValue={user.email} disabled={isPending} />
          {state.fieldErrors?.email && (
            <p className="text-red-500 text-xs font-medium">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="cursor-pointer">
        {isPending ? "Сохранение..." : "Сохранить изменения"}
      </Button>
    </form>
  );
}
