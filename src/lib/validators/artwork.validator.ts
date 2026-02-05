import { z } from 'zod';

export const CreateArtworkSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  imageUrl: z
    .string()
    .url('Image URL must be a valid URL')
    .max(500, 'Image URL must be less than 500 characters'),
  
  creationYear: z
    .number()
    .int('Year must be an integer')
    .min(1000, 'Year must be after 1000')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  
  artistId: z
    .number()
    .int('Artist ID must be an integer')
    .positive('Artist ID must be positive'),
  
  collectionId: z
    .number()
    .int('Collection ID must be an integer')
    .positive('Collection ID must be positive')
});

export const UpdateArtworkSchema = CreateArtworkSchema.partial();

export type CreateArtworkInput = z.infer<typeof CreateArtworkSchema>;
export type UpdateArtworkInput = z.infer<typeof UpdateArtworkSchema>;