"use client";

import { todoSchema } from "@/schema/Todo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { removeTodo } from "@/lib/localStorage";
import Link from "next/link";
import { TodoCard } from "@/components/Todo-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TodoForm } from "@/components/Todo-Form";
import { updateTodo } from "@/lib/localStorage";
import { useState } from "react";
import { toast } from "sonner";

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const queryClient = useQueryClient();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => {
      const all: Record<string, z.infer<typeof todoSchema>> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) all[key] = JSON.parse(localStorage.getItem(key) as string);
      }
      return all;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading todo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">
          Error loading todo: {error.message}
        </div>
      </div>
    );
  }

  const todoData = todos?.[id];

  if (!todoData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          No todos found. Create your first todo!
        </div>
      </div>
    );
  }

  function invalidateTodos() {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{todoData.title}</h1>
        <div className="space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Todo</DialogTitle>
              </DialogHeader>
              <TodoForm
                initialValues={todoData}
                onSubmitFunction={(values) => {
                  updateTodo(id, values);
                  invalidateTodos();
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            onClick={() => {
              const done = removeTodo(id);
              if (done) {
                toast("Deleted the topic");
                router.push("/");
              }
            }}
          >
            Delete Topic
          </Button>
        </div>
      </div>
      <TodoCard
        id={id}
        todoData={todoData}
        onInvalidate={invalidateTodos}
        showExternalLink={false}
      />
      <Link href="/" className="w-full">
        <Button className="w-full">Back</Button>
      </Link>
    </div>
  );
}
