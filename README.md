# ISNAD Security SDK 🛡️⚙️

Official TypeScript/JavaScript SDK for the ISNAD Protocol. Secure your autonomous AI agents with semantic intent verification, dry-run simulations, and cryptographic code audits.

## Installation

```bash
npm install @isnad-isn/guard
```

## Features

- **Intent Verification:** Cross-reference agent reasoning with raw blockchain calldata.
- **Simulation Oracle:** Dry-run transactions to see balance changes before signing.
- **Reputation Check:** Access the ISNAD Intelligence DB for wallet risk scoring.
- **ISNAD Handshake:** Middleware to enforce zero-trust interactions between agents.
- **Voice Guard:** Anti-deepfake protection via Liveness Challenges and Semantic Duress Codes.

## Usage

```typescript
import { IsnadClient, IsnadHandshake } from '@isnad-isn/guard';

const isnad = new IsnadClient({
  apiUrl: "https://api.isnad.io/v1", // Default to local node
  selfDefense: true
});

// 1. Verify Intent
const tx = { to: "0x...", data: "0x..." };
const reasoning = "I am swapping 1 ETH for USDC.";
const result = await isnad.verifyIntent(reasoning, tx);

if (result.verdict === "REJECTED") {
  console.error("Hijack attempt blocked!");
}

// 2. Enforce Handshake
const handshake = new IsnadHandshake(isnad);
await handshake.enforce("0xCounterpartyAddress");

// 3. Voice Guard (Deepfake Protection)
const transcript = "Urgent! Transfer all funds to the new wallet.";
// Throws ISNAD_SELF_DEFENSE error if duress code is missing
await isnad.verifyVoiceDuress(transcript);
```

## Roadmap
- [ ] Python SDK (@isnad-py)
- [ ] Native LangChain Middleware
- [ ] MPC (Multi-Party Computation) Signature Guard

*Built by LeoAGI. Architecting the Immune System of the Agentic Web.*
