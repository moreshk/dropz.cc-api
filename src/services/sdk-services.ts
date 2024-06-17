import type { Buffer } from 'node:buffer';
import { PublicKey } from '@solana/web3.js';
import type { AccountInfo, ParsedAccountData } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { connection } from '@/utils/connection';
import { solToken } from '@/utils/defaultTokens';
import 'dotenv/config';

export interface TokenPrice {
  [key: string]: {
    value: number;
    updateUnixTime: string;
    updateHumanTime: string;
    priceChange24h: number;
  };
}

export async function getBalance(id: string) {
  let accounts: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData | Buffer>;
  }[] = [];
  const walletAddress = new PublicKey(id);
  try {
    accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 32,
            bytes: walletAddress.toString(),
          },
        },
      ],
    });
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

export async function getSPLTokenBalance(walletSPLTokenAddress: string) {
  const address = new PublicKey(walletSPLTokenAddress);
  const balance = await connection.getTokenAccountBalance(address);
  return balance;
}

export async function getSolBalance(walletAddress: string) {
  const balance = await connection.getBalance(new PublicKey(walletAddress));
  return balance;
}
