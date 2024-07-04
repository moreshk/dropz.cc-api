import { PublicKey } from '@solana/web3.js';
import { and, eq } from 'drizzle-orm';
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import { getMint } from '@solana/spl-token';
import { Metadata, deprecated } from '@metaplex-foundation/mpl-token-metadata';
import { db } from '@/utils/db';
import { type NewTokenParams, type UpdateTokenParams, tokens, updateTokenSchema } from '@/schema/tokens';
import '@/env-config';
import { connection } from '@/utils/connection';

export async function addToken(newToken: NewTokenParams, userId: string) {
  const [createdToken] = await db.insert(tokens).values({ ...newToken, id: newToken.address, userId, isVerified: true }).returning();
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

export async function getAllTokensList() {
  return await db.select().from(tokens);
}

export async function getSwapTokens() {
  return await db.select().from(tokens).where(and(eq(tokens.isPumpFun, false), eq(tokens.isMoonShot, false)));
}

export async function getTokenById(tokenId: string) {
  const [token] = await db
    .select()
    .from(tokens)
    .where(and(eq(tokens.id, tokenId)));
  return token;
}

export async function getTokenMetadata(tokenAddress: string) {
  const mintAddress = new PublicKey(tokenAddress);
  const mintInfo = await getMint(connection, mintAddress);
  const metadataPda = await deprecated.Metadata.getPDA(mintAddress);
  const metadataContent = await Metadata.fromAccountAddress(connection, metadataPda);
  const tokenDetails = await (await fetch(metadataContent.data.uri)).json() as {
    name: string;
    symbol: string;
    description: string;
    image: string;
    extensions: {
      website: string;
      twitter: string;
      telegram: string;
    };
  };
  const data: {
    name: string;
    symbol: string;
    decimals: number;
    image: string;
  } = {
    name: tokenDetails.name,
    symbol: tokenDetails.symbol,
    decimals: mintInfo.decimals,
    image: tokenDetails.image,
  };
  return data;
}
