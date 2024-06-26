import type { QuoteResponse } from '@jup-ag/api';
import { solToken, stableUSDC } from '@/utils/defaultTokens';
import type { Token } from '@/schema/tokens';

export async function fetchUSDToAnyTokenValue(token: Token, tokenAmount: string) {
  if (+tokenAmount > 0 && stableUSDC.address !== token.address) {
    try {
      const amount = +tokenAmount * (10 ** stableUSDC.decimals);
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${stableUSDC.address}&outputMint=${
        token.address
      }&amount=${amount.toFixed(0)}`;
      const response = await fetch(url);
      const quoteResponse = await response.json() as QuoteResponse;
      return {
        success: true,
        amount: `${+quoteResponse.outAmount / 10 ** token.decimals}`,
      };
    }
    catch (e) {
      return {
        success: false,
        message: 'error fetching usdc value',
        amount: '0',
      };
    }
  }
  return { amount: `${+tokenAmount}`, success: true };
}

export async function fetchSwapValue(sendToken: Token, receiveToken: Token, tokenAmount: string) {
  if (+tokenAmount > 0) {
    try {
      const amount = +tokenAmount * 10 ** sendToken.decimals;
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${sendToken.address}&outputMint=${
        receiveToken.address
      }&amount=${amount.toFixed(0)}&platformFeeBps=100&slippageBps=2000`;
      const response = await fetch(url);
      const quoteResponse = await response.json() as QuoteResponse;
      if (receiveToken.address === solToken.address) {
        return {
          success: true,
          amount: `${+quoteResponse.outAmount / 10 ** receiveToken.decimals}`,
        };
      }
      else {
        return {
          success: true,
          amount: `${+quoteResponse.outAmount / 10 ** receiveToken.decimals}`,
        };
      }
    }
    catch (e) {
      return {
        success: false,
        message: 'error fetching token value',
        amount: '0',
      };
    }
  }
  return { amount: (+tokenAmount).toFixed(2), success: true };
}
