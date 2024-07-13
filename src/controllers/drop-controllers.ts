import { z } from 'zod';
import { addDrop, deleteDrop, getAllDrops } from '@/services/drops-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const dropAddSchema = z.object({
  body: z.object({
    id: z.string(),
    tokens: z.number(),
  }),
});
export const dropDeleteSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});

export const handleAddDrop = createHandler(dropAddSchema, async (req, res) => {
  const { id, tokens } = req.body;
  const drop = await addDrop(id, tokens);
  if (!drop)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ drop });
});

export const handleGetAllDrop = createHandler(async (req, res) => {
  const drops = await getAllDrops();
  if (!drops)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ drops });
});

export const handleDeleteDrop = createHandler(dropDeleteSchema, async (req, res) => {
  const { id } = req.body;
  const drop = await deleteDrop(id);
  if (!drop)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ drop });
});
