"use client";

import { todoSchema } from "@/schema/Todo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { TodoCard } from "@/components/Todo-item";

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
          <TodoCard
            key={id}
            id={id}
            todoData={todoData}
            onInvalidate={invalidateTodos}
            showExternalLink={true}
          />
        ))}
      </div>
    </div>
  );
}
