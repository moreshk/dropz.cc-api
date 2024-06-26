import process from 'node:process';
import type { ActionGetResponse } from '@solana/actions';
import { widgetIdParamsSchema } from '@/schema/widgets';
import { createHandler } from '@/utils/create';
import { getWidgetById } from '@/services/widget-services';
import '@/env-config';

export const handelGetBlinkMetaData = createHandler(widgetIdParamsSchema, async (req, res) => {
  const { id } = req.params;
  const widget = await getWidgetById(id);
  if (widget) {
    const metadata: ActionGetResponse = {
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
          {
            href: `${process.env.API_BASE_URL}/blink/action/sell/${id}/{sellamount}`,
            label: `Sell ${widget.token.symbol}`,
            parameters: [
              {
                name: 'sellamount',
                label: 'Enter a custom USD amount',
              },
            ],
          },

        ],
      },
    };
    res.status(200).json(metadata);
  }
  else {
    const metadata: ActionGetResponse = {
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
          {
            href: `${process.env.API_BASE_URL}/blink/action/sell/{sellamount}`,
            label: `Sell USDC`,
            parameters: [
              {
                name: 'sellamount',
                label: 'Enter a custom USD amount',
              },
            ],
          },

        ],
      },
    };
    res.status(200).json(metadata);
  }
});
