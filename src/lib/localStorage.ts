import { todoSchema } from "@/schema/Todo";
import z from "zod";

function generateRandomID() {
  return crypto.randomUUID();
}

export function saveTodo(values: z.infer<typeof todoSchema>) {
  const id = generateRandomID();

  localStorage.setItem(id, JSON.stringify(values));
}

export function getAllTodos() {
  const todos: Record<string, typeof todoSchema> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      todos[key] = JSON.parse(localStorage.getItem(key) as string);
    }
  }

  return todos;
}
