import { z } from 'zod';
import { addDrop, deleteDrop, getAllDrops, getDropDetailsById, updateDrop } from '@/services/drops-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const dropAddSchema = z.object({
  body: z.object({
    id: z.string(),
    tokens: z.number(),
    exhausted: z.boolean(),
    maxDuration: z.number(),
  }),
});

export const dropUpdateSchema = z.object({
  body: z.object({
    id: z.string(),
    tokens: z.number(),
    tokenId: z.string(),
    exhausted: z.boolean(),
    maxDuration: z.number(),
    winner: z.number(),
  }),
});

export const dropDeleteSchema = z.object({
  body: z.object({
    id: z.string(),
  }),
});
export const dropDetailsSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const handleAddDrop = createHandler(dropAddSchema, async (req, res) => {
  const { id, tokens, exhausted, maxDuration } = req.body;
  const drop = await addDrop(id, tokens, exhausted, maxDuration);
  if (!drop)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ drop });
});

export const handleUpdateDrop = createHandler(dropUpdateSchema, async (req, res) => {
  const { id, tokens, tokenId, exhausted, maxDuration, winner } = req.body;
  const drop = await updateDrop(tokenId, tokens, id, exhausted, maxDuration, winner);
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
export const handleDropDetails = createHandler(dropDetailsSchema, async (req, res) => {
  const { id } = req.params;
  const drop = await getDropDetailsById(id);
  if (!drop)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ drop });
});

export const handleDeleteDrop = createHandler(dropDeleteSchema, async (req, res) => {
  const { id } = req.body;
  const drop = await deleteDrop(id);
  if (!drop)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ drop });
});
