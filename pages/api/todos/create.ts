// pages/api/todo.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, description } = req.body;
    if (!title && !description) {
      return res
        .status(400)
        .json({ error: "Le titre et la description sont obligatoires." });
    }

    try {
      const newTodo = await prisma.todo.create({
        data: {
          title,
          description,
          completed: false,
        },
      });
      res.status(200).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: "Failed to create todo" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
