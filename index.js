import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// === CONFIG ===
const RPC_URL = process.env.RPC_URL;        // Наприклад: https://mainnet.infura.io/v3/XXXXX
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS; // ERC-20 токен

const ABI = [
  "function transfer(address to, uint amount) returns (bool)"
];

async function main() {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const token = new ethers.Contract(TOKEN_ADDRESS, ABI, wallet);

    // === ARGS FROM CLI ===
    const [, , amount, receiver] = process.argv;

    if (!amount || !receiver) {
      console.error("❌ Використання: node index.js <amount> <receiver_address>");
      process.exit(1);
    }

    console.log("🚀 Відправляємо транзакцію...");
    const decimals = 18;
    const value = ethers.parseUnits(amount, decimals);

    const tx = await token.transfer(receiver, value);

    console.log("⏳ TX відправлено, очікуємо підтвердження...");
    const receipt = await tx.wait();

    console.log("✅ Транзакція виконана!");
    console.log("🔗 TX Hash:", receipt.hash);

  } catch (error) {
    console.error("❌ Помилка:", error.message);
  }
}

main();
