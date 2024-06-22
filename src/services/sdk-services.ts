import type { Buffer } from 'node:buffer';
import { PublicKey } from '@solana/web3.js';
import type { AccountInfo, ParsedAccountData } from '@solana/web3.js';
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import { AccountLayout, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { z } from 'zod';
import { connection } from '@/utils/connection';
import { solToken } from '@/utils/defaultTokens';
import 'dotenv/config';
import { redis } from '@/utils/db';

export interface TokenPrice {
  [key: string]: {
    value: number;
    updateUnixTime: string;
    updateHumanTime: string;
    priceChange24h: number;
  };
}

export async function getBalance(id: string) {
  const accounts: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData | Buffer>;
  }[] = [];
  const walletAddress = new PublicKey(id);
  try {
    const tk22 = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_2022_PROGRAM_ID,
    });
    const tk = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    });
    accounts.push(...tk22.value, ...tk.value);
  }
  catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
  }
  try {
    const allAccounts = accounts
      .map((token) => {
        const data = token.account.data as ParsedAccountData;
        const address = data.parsed.info.mint;
        return address;
      })
      .join(',');
    const solBalance
        = (await connection.getBalance(new PublicKey(walletAddress)))
        / 10 ** solToken.decimals;
    const response = await fetch(
      'https://public-api.birdeye.so/defi/multi_price',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-API-KEY': '6b234866de0740509b9c0eef83e97119',
        },
        body: JSON.stringify({
          list_address: `So11111111111111111111111111111111111111112,mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So${
              allAccounts.length ? `,${allAccounts}` : ''
            }`,
        }),
      },
    );
    const { data } = (await response.json()) as {
      data: TokenPrice;
      success: boolean;
    };
    return { accounts, tokenPrice: data, solBalance };
  }
  catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    return null;
  }
}

export const splTokenBalanceSchema = z.object({
  params: z.object({
    tokenAddress: z.string(),
    decimal: z.string(),
    splTokenAddress: z.string(),
  }),
});

export async function getSPLTokenBalance(walletSPLTokenAddress: string, tokenAddress: string, decimal: string) {
  const address = new PublicKey(walletSPLTokenAddress);
  const price = await getPrice(tokenAddress);
  try {
    const owner = await getOwnerProgramId(new PublicKey(tokenAddress));
    if (owner.equals(TOKEN_PROGRAM_ID)) {
      const balance = await connection.getTokenAccountBalance(address);
      return { balance: balance.value.uiAmount, price };
    }
    else if (owner.equals(TOKEN_2022_PROGRAM_ID)) {
      const tokenAccountInfo = await connection.getAccountInfo(new PublicKey('3FqjVFoEevpkAwiQYrXh6koJe8Q9czCgEXyfrrjYKcLY'));
      if (tokenAccountInfo) {
        const accountData = AccountLayout.decode(tokenAccountInfo.data);
        const balance = accountData.amount.toString();
        return { balance: +balance / (10 ** +decimal), price };
      }
      return { balance: 0, price };
    }
    else {
      return { balance: 0, price };
    }
  }
  catch (e) {
    return { balance: 0, price };
  }
}

async function getOwnerProgramId(mintAddress: PublicKey): Promise<PublicKey> {
  const cacheKey = mintAddress.toString();
  const cachedOwner = await redis.get(cacheKey);
  if (cachedOwner)
    return new PublicKey(cachedOwner);

  const accountInfo = await connection.getAccountInfo(mintAddress);
  if (!accountInfo)
    throw new Error('Failed to find token mint account');
  const owner = accountInfo.owner;
  await redis.set(cacheKey, owner.toString());

  return owner;
}

export async function getSolBalance(walletAddress: string) {
  const balance = await connection.getBalance(new PublicKey(walletAddress));
  const response = await fetch(
      `https://public-api.birdeye.so/defi/price?address=${solToken.address}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-API-KEY': '6b234866de0740509b9c0eef83e97119',
        },
      },
  );
  const { data } = await response.json() as { data: Price };
  const price = data.value;
  return { balance, price };
}

async function getPrice(tokenAddress: string) {
  try {
    const response = await fetch(
      `https://public-api.birdeye.so/defi/price?address=${tokenAddress}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-API-KEY': '6b234866de0740509b9c0eef83e97119',
        },
      },
    );
    const { data } = await response.json() as { data: Price };
    const price = data?.value;
    return price || 0;
  }
  catch (e) {
    console.error(e);
    return 0;
  }
}
interface Price {
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
}
