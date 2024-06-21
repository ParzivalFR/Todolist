"use client";

import { Todo } from "@/app/types/Todo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { toast, ToastPosition, Zoom } from "react-toastify";

const toastOptions = {
  position: "bottom-right" as ToastPosition,
  autoClose: 8000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Zoom,
};

export default function TodoForm() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodo] = useState<string>("");
  const [newTodoDescription, setNewTodoDescription] = useState<string>("");
  const [editingTodo, setEditingTodo] = useState(null as string | null);
  const [editingText, setEditingText] = useState<string>("");
  const router = useRouter();

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const createTodo = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (newTodoTitle.trim() === "") return;

      try {
        const response = await axios.post("/api/todos/create", {
          title: newTodoTitle,
          description: newTodoDescription,
          completed: false,
        });
        toast.success("🎉 Ajouter avec succès", toastOptions);
        setTodos((prevTodos) => [...prevTodos, response.data]);
        setNewTodo("");
        setNewTodoDescription("");
      } catch (error) {
        console.error(error);
      }
    },
    [newTodoTitle, newTodoDescription]
  );

  const deleteTodo = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>, id: string) => {
      e.preventDefault();
      try {
        await axios.delete(`/api/todos/${id}/delete`);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        toast.error("🗑️ Supprimé avec succès", toastOptions);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const updateTodo = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      e.preventDefault();
      try {
        const updatedTodo = { title: editingText };
        await axios.put(`/api/todos/${id}/edit`, updatedTodo);
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, title: editingText } : todo
          )
        );
        setEditingTodo(null);
        setEditingText("");
        toast.info("✏️ Modifié avec succès", toastOptions);
      } catch (error) {
        console.error(error);
      }
    },
    [editingText]
  );

  const toggleTodoCompletion = useCallback(
    async (id: string) => {
      try {
        const todo = todos.find((todo) => todo.id === id);
        if (!todo) return;

        const updatedTodo = { ...todo, completed: !todo.completed };
        await axios.put(`/api/todos/${id}/toggle`, {
          completed: updatedTodo.completed,
        });

        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      } catch (error) {
        console.error(error);
      }
    },
    [todos]
  );

  useEffect(() => {
    fetchTodos().catch(console.error);
  }, [fetchTodos]);

  const todoItems = useMemo(
    () =>
      todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between bg-secondary/50 rounded-md pl-4"
        >
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => toggleTodoCompletion(todo.id)}
          />
          {editingTodo === todo.id ? (
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onBlur={() => setEditingTodo(null)}
              autoFocus
              className="w-full mx-2 bg-background rounded-lg p-2 text-center text-base"
            />
          ) : (
            <span
              onClick={() => {
                setEditingTodo(todo.id);
                setEditingText(todo.title);
              }}
              className="cursor-pointer w-full mx-2 text-sm text-center sm:text-base truncate"
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>
          )}
          <div className="flex">
            <Button
              className="bg-transparent hover:bg-foreground/20 px-2 rounded-lg"
              onClick={(e) => updateTodo(e, todo.id)}
            >
              <FaRegEdit className="size-4 m-0  text-foreground/70" />
            </Button>
            <Button
              className="bg-transparent hover:bg-foreground/20 px-2 rounded-lg"
              onClick={(e) => deleteTodo(e, todo.id)}
            >
              <FaTrashAlt className="size-4 m-0  text-red-500" />
            </Button>
          </div>
        </li>
      )),
    [
      todos,
      editingTodo,
      editingText,
      updateTodo,
      deleteTodo,
      toggleTodoCompletion,
    ]
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 w-full sm:w-4/5 lg:w-3/5 p-6 border border-secondary/50 bg-secondary/60 rounded-lg shadow-lg"
    >
      <h1 className="text-4xl sm:text-6xl text-center">TODO LIST</h1>
      <div className="flex flex-col gap-2 w-full items-end">
        <Input
          placeholder="Entrez votre tâche ici..."
          value={newTodoTitle}
          onChange={(e) => setNewTodo(e.target.value)}
          className="max-w-[300px]"
        />
        <textarea
          placeholder="Entrez la description de votre tâche ici..."
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          className="w-full p-2 rounded-lg bg-background"
        />
        <div className="flex justify-end items-center w-full">
          <Button className="px-8" onClick={createTodo}>
            Ajouter
          </Button>
        </div>
      </div>
      <div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {todoItems}
        </ul>
      </div>
      <Separator className="w-4/5 m-auto" />
      <div className="flex items-center justify-center">
        <Button onClick={() => router.push("/viewtodos")}>
          Voir les tâches
        </Button>
      </div>
    </form>
  );
}
