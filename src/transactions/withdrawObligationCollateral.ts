import { Transaction, TransactionInstruction } from '@solana/web3.js';

import {
  withdrawObligationCollateralInstruction,
  refreshReserveInstruction,
  refreshObligationInstruction,
} from '../instructions';
import {
  withdrawObligationCollateralParams,
  ReserveAndOraclePubkeys,
} from '../models';

export const withdrawObligationCollateralTransaction = (
  params: withdrawObligationCollateralParams,
  obligationReservesAndOraclesPubkeys: Array<ReserveAndOraclePubkeys>
): Transaction => {
  const reserveRefreshInstructions: Array<TransactionInstruction> = obligationReservesAndOraclesPubkeys.map(
    reserveAndOraclePubkeys =>
      refreshReserveInstruction(
        reserveAndOraclePubkeys.reservePubkey,
        reserveAndOraclePubkeys.oraclePubkey
      )
  );

  return new Transaction()
    .add(
      ...reserveRefreshInstructions,
      refreshObligationInstruction(
        params.obligationPubkey,
        obligationReservesAndOraclesPubkeys.map(item => item.reservePubkey)
      )
    )
    .add(withdrawObligationCollateralInstruction(params));
};
