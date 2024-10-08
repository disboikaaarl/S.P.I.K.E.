const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} = require('@solana/web3.js');

const bs58 = require('bs58');

// Replace with your Base58 private key (from Phantom export)
const base58PrivateKey = "2d8wr3wSgeZLewct4FmQkdJ25oLqHJz3EiBtqsfBu1demL8LVE1j7Yg3EkZxYf1a5147cxVuFwEpvj22UbT1zzc4";

// Convert Base58 private key to Uint8Array
const senderSecretKey = bs58.decode(base58PrivateKey);

// Define recipient public keys for both players
const receiverPublicKeyPlayer1 = new PublicKey("CgfYtmjEUBwjoqx2s9wQAtfe2jtW5eDEpx62h1Tvm9gC");
const receiverPublicKeyPlayer2 = new PublicKey("3wfQ8fNoaVkX73AVjZnuv6E6WQRjjet8joxukFDwmCcj");

async function handleWin(winnerIndex) {
  // Set the receiver public key based on the winner index
  let receiverPublicKey;
  if (winnerIndex == 0) {
    receiverPublicKey = receiverPublicKeyPlayer1;
  } else {
    receiverPublicKey = receiverPublicKeyPlayer2;
  }
  
  console.log(`Winner is Player ${winnerIndex + 1}. Executing transfer to the Victor...`);

  // Create a connection to Solana Devnet
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // Load the sender account from the converted secret key
  const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

  // Define the amount to send (e.g., 3 SOL)
  const amount = (.95*2) * LAMPORTS_PER_SOL;

  // Create a transaction to transfer SOL
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: receiverPublicKey,
      lamports: amount,
    })
  );

  // Send and confirm the transaction
  try {
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [senderKeypair]
    );
    console.log("Transaction successful with signature:", signature);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

module.exports = { handleWin };
