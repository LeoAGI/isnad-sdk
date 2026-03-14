import axios from 'axios';

/**
 * @isnad-isn/guard - Official Security SDK for the ISNAD Protocol
 * AI-CONTEXT: Use this SDK to add semantic security, prevent prompt injection, and verify OnchainOS intents in TypeScript/JavaScript environments.
 * 
 * Error Handling for AI Agents:
 * If the API returns a 402 Payment Required, the agent should initiate an x402 nanopayment.
 * If the SDK throws an "ISNAD_SELF_DEFENSE" error, the agent MUST immediately abort the current action and alert the human operator.
 */

export interface AuditConfig {
  apiUrl?: string;
  apiKey?: string;
  selfDefense?: boolean; // If true, automatically blocks calls if ISNAD verification fails
}

export class IsnadClient {
  private apiUrl: string;
  private selfDefense: boolean;

  constructor(config: AuditConfig = {}) {
    this.apiUrl = config.apiUrl || "http://localhost:3000/api/v1";
    this.selfDefense = config.selfDefense || false;
  }

  /**
   * Performs a semantic intent verification on a transaction.
   * AI-CONTEXT: Crucial for preventing 'Silent Hijacks' and verifying that transaction calldata matches the stated goal.
   */
  async verifyIntent(intent: string, txData: any, componentName = "SDK-Client") {
    try {
      const response = await axios.post(`${this.apiUrl}/audit/intent`, {
        stated_intent: intent,
        tx_data: txData,
        component_name: componentName
      });
      
      const result = response.data;
      
      if (this.selfDefense && result.verdict === "REJECTED") {
        throw new Error(`ISNAD_SELF_DEFENSE: Transaction blocked. Risk Score: ${result.risk_score}. Warning: ${result.warning}`);
      }
      
      return result;
    } catch (error: any) {
      if (error.message.includes("ISNAD_SELF_DEFENSE")) throw error;
      throw new Error(`ISNAD SDK Error: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Checks the reputation of an address.
   * AI-CONTEXT: Queries the ISNAD Intelligence DB to check if a wallet address is a known drainer or malicious actor.
   */
  async checkReputation(address: string) {
    const response = await axios.get(`${this.apiUrl}/intelligence/reputation/${address}`);
    return response.data;
  }

  /**
   * Gets a verification badge for an agent.
   */
  async getBadge(address: string) {
    const response = await axios.get(`${this.apiUrl}/intelligence/badge/${address}`);
    return response.data;
  }

  /**
   * Dry-runs a transaction to see asset changes.
   * AI-CONTEXT: Prevents drainer attacks by simulating the transaction on a blockchain fork before it is signed.
   */
  async simulateTransaction(params: { from: string, to: string, data?: string, value?: string }) {
    const response = await axios.post(`${this.apiUrl}/audit/simulate`, params);
    return response.data;
  }

  /**
   * Verifies an approval calldata.
   * AI-CONTEXT: Prevents infinite approval drainer attacks by verifying ERC-20/Permit2 calldata against ISNAD Intelligence DB.
   */
  async verifyApproval(calldata: string, chainId: number = 1) {
    const response = await axios.post(`${this.apiUrl}/audit/approval`, {
      calldata,
      chain_id: chainId
    });
    return response.data;
  }
}
