import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

// pages/api/todos/[id]/edit.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id } = req.query;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const updatedTodo = await prisma.todo.update({
        where: { id: id as string },
        data: {
          title,
        },
      });
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update todo" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
