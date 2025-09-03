"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { removeTodo, updateTodo } from "@/lib/localStorage";
import { todoSchema } from "@/schema/Todo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export function TodoList() {
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => {
      console.log("Updating Todos");
      const todos: Record<string, z.infer<typeof todoSchema>> = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          todos[key] = JSON.parse(localStorage.getItem(key) as string);
        }
      }

      console.log(todos);

      return todos;
    },
  });

  const queryClient = useQueryClient();

  function invalidateTodos() {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">
          Error loading todos: {error.message}
        </div>
      </div>
    );
  }

  if (!todos || Object.keys(todos).length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          No todos found. Create your first todo!
        </div>
      </div>
    );
  }

  return (
    <div className=" w-2/3 mx-auto">
      <h1 className="text-2xl font-bold">All Todos:</h1>
      <div className="gap-4 grid grid-cols-1 py-6 lg:grid-cols-2">
        {Object.entries(todos).map(([id, todoData]) => (
          <div key={id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {todoData.title}
              </h3>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  removeTodo(id);
                  invalidateTodos();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {todoData.todos.map((todo, index) => (
                <div
                  key={`${id}-${index}-${todo.todo}-${todo.done}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    className="cursor-pointer"
                    checked={todo.done}
                    onCheckedChange={(checked) => {
                      const todoDataCopy = JSON.parse(JSON.stringify(todoData));
                      todoDataCopy.todos[index].done = !!checked;
                      updateTodo(id, todoDataCopy);
                      invalidateTodos();
                    }}
                  />
                  <span
                    className={`flex-1 ${
                      todo.done
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.todo}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const todoDataCopy = JSON.parse(JSON.stringify(todoData));
                      todoDataCopy.todos = todoData.todos.filter(
                        (_, i) => i != index
                      );
                      if (todoDataCopy.todos.length == 0) {
                        toast.warning("Couldn't delete the todo", {
                          description: "There is one todo left in the topic",
                        });
                        return;
                      }
                      updateTodo(id, todoDataCopy);
                      invalidateTodos();
                    }}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
