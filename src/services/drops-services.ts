import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import '@/env-config';
import { drops } from '@/schema/drops';

export async function addDrop(tokenId: string, tokens: number) {
  const [createDrop] = await db.insert(drops).values({ tokenId, tokens, listing: true }).returning();
  return createDrop;
}

export async function getAllDrops() {
  const dropsList = await db.query.drops.findMany({
    with: {
      token: true,
    },
  }); ;
  return dropsList;
}

export async function deleteDrop(dropId: string) {
  const [t] = await db
    .delete(drops)
    .where(eq(drops.id, dropId))
    .returning();

  return t;
}
