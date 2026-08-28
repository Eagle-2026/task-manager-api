const { z } = require("zod");


//create
const createTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    completed: z
      .boolean()
      .optional(),
  })
  .strict();


//update
const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  completed: z
    .boolean()
    .optional(),
});
module.exports = {
  createTaskSchema,
  updateTaskSchema
};
