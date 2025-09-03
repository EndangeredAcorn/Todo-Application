import { TodoForm } from "@/components/Todo-Form";
import { TodoList } from "@/components/Todo-list";

export default function Home() {
  return (
    <>
      <div className="w-2/3 mx-auto py-6">
        <TodoForm />
      </div>

      <TodoList />
    </>
  );
}
