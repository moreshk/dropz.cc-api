import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import '@/env-config';
import { drops } from '@/schema/drops';

export async function addDrop(tokenId: string, tokens: number, exhausted: boolean, maxDuration: number, winners: number) {
  const [createDrop] = await db.insert(drops).values({ tokenId, tokens, listing: true, exhausted, winners, maxDuration }).returning();
  return createDrop;
}

export async function updateDrop(tokenId: string, tokens: number, id: string, exhausted: boolean, maxDuration: number, winner: number) {
  const [updatedDrop] = await db
    .update(drops)
    .set({ tokenId, tokens, exhausted, maxDuration, winners: winner })
    .where(eq(drops.id, id))
    .returning();
  return updatedDrop;
}

export async function getDropDetailsById(id: string) {
  return await db.query.drops.findFirst({
    where: eq(drops.id, id),
    with: {
      token: true,
    },
  });
}

export async function getAllDrops() {
  const dropsList = await db.query.drops.findMany({
    with: {
      token: true,
    },
  });
  return dropsList;
}

export async function deleteDrop(dropId: string) {
  const [t] = await db
    .delete(drops)
    .where(eq(drops.id, dropId))
    .returning();

  return t;
}
