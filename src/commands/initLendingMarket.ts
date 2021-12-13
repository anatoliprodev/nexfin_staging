import * as web3 from '@solana/web3.js';
import {
  Connection,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { LendingMarketLayout } from '../models';
import { initLendingMarketTransaction } from '../transactions';

export async function initLendingMarketCommand(
  connection: Connection,
  ownerPubkey: PublicKey,
  quoteCurrency: string,
  payer: Keypair
): Promise<PublicKey> {
  //create Lending Market Account
  const LendingMarketInitBalanceNeeded = await connection.getMinimumBalanceForRentExemption(
    LendingMarketLayout.span
  );

  const lendingMarketAccount = Keypair.generate();
  var airdropSignature = await connection.requestAirdrop(
    lendingMarketAccount.publicKey,
    web3.LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);
  console.log("Airdrop to FROM ACC Success, Signature: ",airdropSignature )

  //init LendingMarket by sending initLendingMarketTransaction and making payer an owner
  const initTransaction = initLendingMarketTransaction(
    lendingMarketAccount.publicKey,
    quoteCurrency,
    ownerPubkey,
    LendingMarketInitBalanceNeeded
  );

  await sendAndConfirmTransaction(
    connection,
    initTransaction,
    [payer, lendingMarketAccount],
    {
      commitment: 'singleGossip',
      preflightCommitment: 'singleGossip',
    }
  );

  console.log("lendingMarketAccount.publicKey generated: ", lendingMarketAccount.publicKey)

  return lendingMarketAccount.publicKey;
}
