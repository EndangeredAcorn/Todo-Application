"use client";

import { todoSchema } from "@/schema/Todo";
import { toast } from "sonner";
import z from "zod";

function generateRandomID() {
  return crypto.randomUUID();
}

export function saveTodo(values: z.infer<typeof todoSchema>) {
  const id = generateRandomID();

  localStorage.setItem(id, JSON.stringify(values));
  toast.success("Todo Created");
}
export function removeTodo(id: string) {
  const item = localStorage.getItem(id);
  if (!item) {
    toast.warning("Couldn't delete Todo", {
      description: "Couldn't find the todo",
    });
    return false;
  }

  localStorage.removeItem(id);
  return true;
}

export function updateTodo(id: string, todo: z.infer<typeof todoSchema>) {
  const item = localStorage.getItem(id);
  if (!item) {
    toast.warning("Couldn't update Todo", {
      description: "Couldn't find the todo",
    });
    return;
  }
  localStorage.setItem(id, JSON.stringify(todo));
  toast.success("Todo Updated");
}
