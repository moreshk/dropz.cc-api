import { getReferrals } from '@/services/referral-services';
import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export const handelGetReferral = createHandler(async (req, res) => {
  const referral = await getReferrals();
  if (!referral)
    throw new BackendError('NOT_FOUND');
  res.status(200).json({ referral });
});
