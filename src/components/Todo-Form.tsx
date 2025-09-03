"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveTodo } from "@/lib/localStorage";
import { todoSchema } from "@/schema/Todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function TodoForm() {
  const queryClient = useQueryClient();

  function invalidateTodos() {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  }

  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      todos: [{ done: false, todo: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "todos",
  });

  function onSubmit(values: z.infer<typeof todoSchema>) {
    const finalTodos = [];

    for (const todo of values.todos) {
      if (todo.todo.trim() != "") {
        finalTodos.push(todo);
      }
    }

    console.log(finalTodos);

    if (finalTodos.length === 0) {
      toast.error("Todo Cannot be saved!", {
        description: "Add atleast 1 todo item",
      });
      return;
    }

    saveTodo({ title: values.title, todos: finalTodos });
    invalidateTodos();
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title: </FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center space-x-2 p-2 border rounded-md"
          >
            {/* <FormField
              control={form.control}
              name={`todos.${index}.done`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name={`todos.${index}.todo`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Enter todo..."
                      {...field}
                      className="border-0 focus-visible:ring-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
              <X />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          type="button"
          className="border-2 border-dashed"
          onClick={() => append({ done: false, todo: "" })}
        >
          + Add Todo
        </Button>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
