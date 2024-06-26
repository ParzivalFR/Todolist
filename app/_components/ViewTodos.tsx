"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Todo } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function ViewTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("/api/todos");
      const data = response.data;
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchTodos().catch(console.error);
  }, [fetchTodos]);

  return (
    <section className="h-full w-svw flex flex-col items-center gap-10 p-6">
      <h1 className="text-6xl sm:text-8xl font-bold">Todos</h1>
      <div className="flex items-center justify-center gap-6 w-full flex-wrap">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="relative flex flex-col items-center gap-2 p-4 max-w-[300px] w-full h-full min-h-[150px] bg-secondary/30 border border-secondary/40 rounded-md shadow-md"
          >
            <div className="w-full flex flex-col items-center gap-2">
              <h2 className="text-xl font-bold">{todo.title}</h2>
              <Separator className="w-40" />
            </div>
            <p className="w-full h-full m-auto flex justify-center text-sm text-center">
              {todo.description}
            </p>
            <span className="absolute -top-2 -right-2 text-2xl">
              {todo.completed ? (
                <IoMdCheckmarkCircleOutline className="text-green-500/80" />
              ) : (
                <AiOutlineCloseCircle className="text-red-500/80" />
              )}
            </span>
          </div>
        ))}
      </div>
      <Button onClick={() => router.back()} className="max-w-[100px]">
        Retour
      </Button>
    </section>
  );
}
