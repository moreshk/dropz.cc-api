import { eq } from 'drizzle-orm';
import { referral } from '@/schema/referral';
import { db } from '@/utils/db';

export async function getReferralById(referralId: string) {
  return await db.query.referral.findFirst({
    where: eq(referral.id, referralId),
    with: {
      token: true,
    },
  });
}

export async function getReferrals() {
  return await db.query.referral.findMany({
    with: {
      token: true,
    },
  });
}

export async function getReferralByWalletAddress(walletAddress: string) {
  return await db.query.referral.findFirst({
    where: eq(referral.feeWalletAddress, walletAddress),
    with: {
      token: true,
    },
  });
}
