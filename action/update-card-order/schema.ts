import { z } from "zod";

export const UpdateCardOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      createdAt: z.date(),
      listId: z.string(),
      updatedAt: z.date(),
    }),
  ),
  boardId: z.string(),
});