import process from 'node:process';
import { and, eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { type NewTokenParams, type UpdateTokenParams, tokens, updateTokenSchema } from '@/schema/tokens';
import '@/env-config';

export async function addToken(newToken: NewTokenParams, userId: string) {
  const [createdToken] = await db.insert(tokens).values({ ...newToken, id: newToken.address, userId }).returning();
  return createdToken;
}
export async function updateToken(tokenId: string, token: UpdateTokenParams, userId: string) {
  const [updatedToken] = await db
    .update(tokens)
    .set({ ...token, updatedAt: new Date(), createdAt: undefined })
    .where(and(eq(tokens.id, tokenId), eq(tokens.userId, userId)))
    .returning();
  return updatedToken;
}

export async function deleteToken(tokenId: string, userId: string) {
  const [t] = await db
    .delete(tokens)
    .where(and(eq(tokens.id, tokenId), eq(tokens.userId, userId)))
    .returning();
  return t;
}

export async function populateToken(userId: string) {
  interface Token {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    logoURI: string;
    chainId: number;
    extensions?: {
      coingeckoId: string;
    };
  }
  const data = await fetch('https://token.jup.ag/strict');
  const splTokens = (await data.json()) as Token[];
  const processedData = splTokens.map(token => ({
    address: token.address,
    id: token.address,
    chainId: token.chainId,
    userId,
    coingeckoId: token?.extensions?.coingeckoId,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    imageUrl: token.logoURI,
  }));
  await db.insert(tokens).values(processedData);
  return { success: true };
}

export async function getUsersTokens(userId: string) {
  return await db.select().from(tokens).where(eq(tokens.userId, userId!));
}

export async function getAllTokens() {
  return await db.select().from(tokens);
}

export async function getTokenById(tokenId: string) {
  const [token] = await db
    .select()
    .from(tokens)
    .where(and(eq(tokens.id, tokenId)));
  return token;
}

export async function getTokenMetadata(tokenAddress: string) {
  const response = await fetch(process.env.RPC_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: tokenAddress,
        displayOptions: {
          showFungible: true,
        },
      },
    }),
  });
  const responseData = await response.json() as any;
  const data: {
    name: string;
    symbol: string;
    decimals: number;
    image: string;
  } = {
    name: responseData.result.content.metadata.name,
    symbol: responseData.result.content.metadata.symbol,
    decimals: responseData.result.token_info.decimals,
    image: responseData.result.content?.links?.image,
  };
  return data;
}
