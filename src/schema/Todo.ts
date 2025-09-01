import * as z from "zod";

export const singleTodoSchema = z.object({
  done: z.boolean().default(false).nonoptional(),
  todo: z.string(),
});

export const todoSchema = z.object({
  title: z.string().min(1, "Title must be longer than 1 character"),
  todos: z.array(singleTodoSchema),
});
