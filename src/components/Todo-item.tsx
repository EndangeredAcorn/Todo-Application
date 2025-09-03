"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { removeTodo, updateTodo } from "@/lib/localStorage";
import { todoSchema } from "@/schema/Todo";
import { ExternalLink, Trash2, X } from "lucide-react";
import Link from "next/link";
import z from "zod";
import { toast } from "sonner";

export function TodoCard({
  id,
  todoData,
  onInvalidate,
  showExternalLink = true,
}: {
  id: string;
  todoData: z.infer<typeof todoSchema>;
  onInvalidate: () => void;
  showExternalLink?: boolean;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        {todoData.title}
        {showExternalLink && (
          <div className="space-x-2">
            <Button variant={"outline"} size={"icon"} className="h-8 w-8">
              <Link href={`/todo/${id}`}>
                <ExternalLink />
              </Link>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                removeTodo(id);
                onInvalidate();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {todoData.todos.map((todo, index) => (
          <TodoItem
            key={`${id}-${index}-${todo.todo}-${todo.done}`}
            id={id}
            index={index}
            todo={todo}
            todoData={todoData}
            onInvalidate={onInvalidate}
          />
        ))}
      </div>
    </div>
  );
}

function TodoItem({
  id,
  index,
  todo,
  todoData,
  onInvalidate,
}: {
  id: string;
  index: number;
  todo: { done: boolean; todo: string };
  todoData: z.infer<typeof todoSchema>;
  onInvalidate: () => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        className="cursor-pointer"
        checked={todo.done}
        onCheckedChange={(checked) => {
          const todoDataCopy = JSON.parse(JSON.stringify(todoData));
          todoDataCopy.todos[index].done = !!checked;
          updateTodo(id, todoDataCopy);
          onInvalidate();
        }}
      />
      <span
        className={`flex-1 ${
          todo.done ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {todo.todo}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const todoDataCopy = JSON.parse(JSON.stringify(todoData));
          todoDataCopy.todos = todoData.todos.filter((_, i) => i != index);
          if (todoDataCopy.todos.length == 0) {
            toast.warning("Couldn't delete the todo", {
              description: "There is one todo left in the topic",
            });
            return;
          }
          updateTodo(id, todoDataCopy);
          onInvalidate();
        }}
      >
        <X />
      </Button>
    </div>
  );
}
