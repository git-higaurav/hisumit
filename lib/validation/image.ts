import { z } from 'zod';

export const imageFormSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters long')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters'),
  imageUrl: z.string()
    .url('Please provide a valid image URL')
    .refine(
      (url) => url.match(/\.(jpg|jpeg|png|webp)$/i),
      'Only .jpg, .jpeg, .png, and .webp formats are supported'
    ),
  public_id: z.string({
    required_error: "Assets public id is required",
    invalid_type_error: "Public id must be a string"
  }).min(1, "Assets public id can't be empty")
});

export type ImageFormData = z.infer<typeof imageFormSchema>;