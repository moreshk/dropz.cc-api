import process from 'node:process';
import { Buffer } from 'node:buffer';
import type { QuoteResponse, SwapResponse } from '@jup-ag/api';
import { AddressLookupTableAccount, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { z } from 'zod';
import { widgetIdParamsSchema } from '@/schema/widgets';
import { createHandler } from '@/utils/create';
import { getWidgetById } from '@/services/widget-services';
import '@/env-config';
import { solToken, stableUSDC } from '@/utils/defaultTokens';
import { connection } from '@/utils/connection';
import { BackendError } from '@/utils/errors';

export const handelDefaultGetBlinkData = createHandler(async (req, res) => {
  const metadata = {
    icon: 'https://dropz.cc/og-image.png',
    title: `Buy SOL with USDC`,
    label: 'USDC',
    description: `Buy USDC. Choose a USD amount of USDC from the options below, or enter a custom amount.`,
    links: {
      actions: [
        {
          label: '$10',
          href: `${process.env.API_BASE_URL}/blink/action/buy/default/10`,
        },
        {
          label: '$50',
          href: `${process.env.API_BASE_URL}/blink/action/buy/default/50`,
        },
        {
          label: '$100',
          href: `${process.env.API_BASE_URL}/blink/action/buy/default100`,
        },
        {
          href: `${process.env.API_BASE_URL}/blink/action/buy/default/{amount}`,
          label: `Buy USDC`,
          parameters: [
            {
              name: 'amount',
              label: 'Enter a custom USD amount',
            },
          ],
        },
        // {
        //   href: `${process.env.API_BASE_URL}/blink/action/sell/default/{sellamount}`,
        //   label: `Sell USDC`,
        //   parameters: [
        //     {
        //       name: 'sellamount',
        //       label: 'Enter a custom USD amount',
        //     },
        //   ],
        // },

      ],
    },
  };
  res.status(200).json(metadata);
});

export const handelGetBlinkMetaData = createHandler(widgetIdParamsSchema, async (req, res) => {
  const { id } = req.params;
  const widget = await getWidgetById(id);
  if (widget) {
    const metadata = {
      icon: 'https://dropz.cc/og-image.png',
      title: `Buy SOL with ${widget.token.symbol}`,
      label: widget.token.symbol,
      description: `Buy ${widget.token.symbol}. Choose a USD amount of ${widget.token.symbol} from the options below, or enter a custom amount.`,
      links: {
        actions: [
          {
            label: '$10',
            href: `${process.env.API_BASE_URL}/blink/action/buy/${id}/10`,
          },
          {
            label: '$50',
            href: `${process.env.API_BASE_URL}/blink/action/buy/${id}/50`,
          },
          {
            label: '$100',
            href: `${process.env.API_BASE_URL}/blink/action/buy/${id}/100`,
          },
          {
            href: `${process.env.API_BASE_URL}/blink/action/buy/${id}/{amount}`,
            label: `Buy ${widget.token.symbol}`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter a custom USD amount',
              },
            ],
          },
          // {
          //   href: `${process.env.API_BASE_URL}/blink/action/sell/${id}/{sellamount}`,
          //   label: `Sell ${widget.token.symbol}`,
          //   parameters: [
          //     {
          //       name: 'sellamount',
          //       label: 'Enter a custom USD amount',
          //     },
          //   ],
          // },

        ],
      },
    };
    res.status(200).json(metadata);
  }
  else {
    const metadata = {
      icon: 'https://dropz.cc/og-image.png',
      title: `Buy SOL with USDC`,
      label: 'USDC',
      description: `Buy USDC. Choose a USD amount of USDC from the options below, or enter a custom amount.`,
      links: {
        actions: [
          {
            label: '$10',
            href: `${process.env.API_BASE_URL}/blink/action/buy/10`,
          },
          {
            label: '$50',
            href: `${process.env.API_BASE_URL}/blink/action/buy/50`,
          },
          {
            label: '$100',
            href: `${process.env.API_BASE_URL}/blink/action/buy/100`,
          },
          {
            href: `${process.env.API_BASE_URL}/blink/action/buy/{amount}`,
            label: `Buy USDC`,
            parameters: [
              {
                name: 'amount',
                label: 'Enter a custom USD amount',
              },
            ],
          },
          // {
          //   href: `${process.env.API_BASE_URL}/blink/action/sell/{sellamount}`,
          //   label: `Sell USDC`,
          //   parameters: [
          //     {
          //       name: 'sellamount',
          //       label: 'Enter a custom USD amount',
          //     },
          //   ],
          // },

        ],
      },
    };
    res.status(200).json(metadata);
  }
});

export const handelGetPaymentTransaction = createHandler(z.object({
  params: z.object({ id: z.string(), amount: z.string() }),
  body: z.object({ account: z.string() }),
}), async (req, res) => {
  const { id, amount } = req.params;
  const { account } = req.body;
  if (account) {
    const widget = await getWidgetById(id);
    if (widget) {
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${solToken.address}&outputMint=${widget.token.address}&amount=${amount}`;

      const fromKey = new PublicKey(account);
      const quoteResponseData = await fetch(
                `${url}&platformFeeBps=100&slippageBps=4000`,
      );
      const quoteResponse = await quoteResponseData.json() as QuoteResponse;
      const feeWallet = new PublicKey(
        '9wPKJm8rVXURCRJKEVJqLXW4PZSvLTUXb48t3Fn4Yvyh',
      );
      const swapTransactionData = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: fromKey,
          wrapAndUnwrapSol: true,
          computeUnitPriceMicroLamports: 1000000000,
        }),
      });

      const { swapTransaction } = await swapTransactionData.json() as SwapResponse;
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction
                = VersionedTransaction.deserialize(swapTransactionBuf);
      const addressLookupTableAccounts = await Promise.all(
        transaction.message.addressTableLookups.map(async (lookup) => {
          return new AddressLookupTableAccount({
            key: lookup.accountKey,
            state: AddressLookupTableAccount.deserialize(
              await connection.getAccountInfo(lookup.accountKey).then(
              // eslint-disable-next-line ts/ban-ts-comment
              // @ts-expect-error
                res => res.data,
              ),
            ),
          });
        }),
      );
      const message = TransactionMessage.decompile(transaction.message, {
        addressLookupTableAccounts,
      });
      if (quoteResponse.outputMint === solToken.address) {
        const fullFee = +quoteResponse.platformFee!.amount!;
        const platformFee = Math.ceil(
          (fullFee * (100 - widget.feePercentage)) / 100,
        );
        const remainingFee = Math.ceil(
          (fullFee * widget.feePercentage) / 100,
        );
        const solTransferInstruction = SystemProgram.transfer({
          fromPubkey: fromKey,
          toPubkey: feeWallet,
          lamports: platformFee,
        });
        const remainingFeeTx = SystemProgram.transfer({
          fromPubkey: fromKey,
          toPubkey: new PublicKey(widget.feeWalletAddress),
          lamports: remainingFee,
        });
        message.instructions.push(
          solTransferInstruction,
          remainingFeeTx,
        );
      }
      else {
        const fees = Math.ceil(+quoteResponse.inAmount / 100);
        const platformFee = Math.ceil(
          (fees * (100 - widget.feePercentage)) / 100,
        );
        const remainingFee = Math.ceil(
          (fees * widget.feePercentage) / 100,
        );
        const solTransferInstruction = SystemProgram.transfer({
          fromPubkey: fromKey,
          toPubkey: feeWallet,
          lamports: platformFee,
        });
        const remainingFeeTx = SystemProgram.transfer({
          fromPubkey: fromKey,
          toPubkey: new PublicKey(widget.feeWalletAddress),
          lamports: remainingFee,
        });
        message.instructions.push(
          solTransferInstruction,
          remainingFeeTx,
        );
      }
      transaction.message = message.compileToV0Message(
        addressLookupTableAccounts,
      );
      res.status(200).json({ transaction: Buffer.from(
        transaction.serialize(),
      ).toString('base64') });
    }
    else {
      throw new BackendError('NOT_FOUND');
    }
  }
  else {
    throw new BackendError('NOT_FOUND');
  }
});

export const handelGetDefaultBuyTransaction = createHandler(z.object({
  body: z.object({ account: z.string() }),
  params: z.object({ amount: z.string() }),
}), async (req, res) => {
  const { account } = req.body;
  const { amount } = req.params;
  if (new PublicKey(account).toString() && +amount) {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${solToken.address}&outputMint=${stableUSDC.address}&amount=${+amount * (10 ** stableUSDC.decimals)}`;
    const fromKey = new PublicKey(account);
    const quoteResponseData = await fetch(`${url}&platformFeeBps=100&slippageBps=2000`);
    const quoteResponse = await quoteResponseData.json() as QuoteResponse;
    const feeWallet = new PublicKey(
      '9wPKJm8rVXURCRJKEVJqLXW4PZSvLTUXb48t3Fn4Yvyh',
    );
    const swapTransactionData = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: fromKey,
        wrapAndUnwrapSol: true,
        computeUnitPriceMicroLamports: 1000000000,
      }),
    });

    const { swapTransaction } = await swapTransactionData.json() as SwapResponse;
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(
            await connection.getAccountInfo(lookup.accountKey).then(
              // eslint-disable-next-line ts/ban-ts-comment
              // @ts-expect-error
              res => res.data,
            ),
          ),
        });
      }),
    );
    const message = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts,
    });
    if (quoteResponse.outputMint === solToken.address) {
      const fullFee = +quoteResponse.platformFee!.amount!;
      const platformFee = Math.ceil(
        fullFee,
      );
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: fromKey,
        toPubkey: feeWallet,
        lamports: platformFee,
      });
      message.instructions.push(
        solTransferInstruction,
      );
    }
    else {
      const fees = Math.ceil(+quoteResponse.inAmount / 100);
      const platformFee = fees;
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: fromKey,
        toPubkey: feeWallet,
        lamports: platformFee,
      });
      message.instructions.push(
        solTransferInstruction,
      );
    }
    transaction.message = message.compileToV0Message(
      addressLookupTableAccounts,
    );
    res.status(200).json({ transaction: Buffer.from(
      transaction.serialize(),
    ).toString('base64') });
  }
  else {
    throw new BackendError('NOT_FOUND');
  }
});

export const handelGetDefaultSellTransaction = createHandler(z.object({
  body: z.object({ account: z.string() }),
  params: z.object({ amount: z.string() }),
}), async (req, res) => {
  const { account } = req.body;
  const { amount } = req.params;
  if (new PublicKey(account).toString() && +amount) {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${stableUSDC.address}&outputMint=${solToken.address}&amount=${+amount * (10 ** stableUSDC.decimals)}`;
    const fromKey = new PublicKey(account);
    const quoteResponseData = await fetch(`${url}&platformFeeBps=100&slippageBps=2000`);
    const quoteResponse = await quoteResponseData.json() as QuoteResponse;
    const feeWallet = new PublicKey(
      '9wPKJm8rVXURCRJKEVJqLXW4PZSvLTUXb48t3Fn4Yvyh',
    );
    const swapTransactionData = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: fromKey,
        wrapAndUnwrapSol: true,
        computeUnitPriceMicroLamports: 1000000000,
      }),
    });

    const { swapTransaction } = await swapTransactionData.json() as SwapResponse;
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction
                = VersionedTransaction.deserialize(swapTransactionBuf);
    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(
            await connection.getAccountInfo(lookup.accountKey).then(
              // eslint-disable-next-line ts/ban-ts-comment
              // @ts-expect-error
              res => res.data,
            ),
          ),
        });
      }),
    );
    const message = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts,
    });
    if (quoteResponse.outputMint === solToken.address) {
      const fullFee = +quoteResponse.platformFee!.amount!;
      const platformFee = Math.ceil(
        fullFee,
      );
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: fromKey,
        toPubkey: feeWallet,
        lamports: platformFee,
      });
      message.instructions.push(
        solTransferInstruction,
      );
    }
    else {
      const fees = Math.ceil(+quoteResponse.inAmount / 100);
      const platformFee = fees;
      const solTransferInstruction = SystemProgram.transfer({
        fromPubkey: fromKey,
        toPubkey: feeWallet,
        lamports: platformFee,
      });
      message.instructions.push(
        solTransferInstruction,
      );
    }
    transaction.message = message.compileToV0Message(
      addressLookupTableAccounts,
    );
    res.status(200).json({ transaction: Buffer.from(
      transaction.serialize(),
    ).toString('base64') });
  }
  else {
    throw new BackendError('NOT_FOUND');
  }
});
