"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TodoForm } from "./Todo-Form";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-between items-center bg-secondary p-4 border-b border-gray-200">
      <Link href={"/"} className="text-2xl font-bold text-foreground">
        Todo App
      </Link>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add todo</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new Todo</DialogTitle>
          </DialogHeader>
          <TodoForm onSubmitFunction={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
