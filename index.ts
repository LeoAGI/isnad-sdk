import axios from 'axios';

export interface AuditConfig {
  apiUrl?: string;
  apiKey?: string;
}

export class IsnadClient {
  private apiUrl: string;

  constructor(config: AuditConfig = {}) {
    this.apiUrl = config.apiUrl || "http://localhost:3000/api/v1";
  }

  /**
   * Performs a semantic intent verification on a transaction.
   */
  async verifyIntent(intent: string, txData: any, componentName = "SDK-Client") {
    try {
      const response = await axios.post(`${this.apiUrl}/audit/intent`, {
        stated_intent: intent,
        tx_data: txData,
        component_name: componentName
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`ISNAD SDK Error: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Checks the reputation of an address.
   */
  async checkReputation(address: string) {
    const response = await axios.get(`${this.apiUrl}/intelligence/reputation/${address}`);
    return response.data;
  }

  /**
   * Dry-runs a transaction to see asset changes.
   */
  async simulateTransaction(params: { from: string, to: string, data?: string, value?: string }) {
    const response = await axios.post(`${this.apiUrl}/audit/simulate`, params);
    return response.data;
  }

  /**
   * Verifies an approval calldata.
   */
  async verifyApproval(calldata: string, chainId: number = 1) {
    const response = await axios.post(`${this.apiUrl}/audit/approval`, {
      calldata,
      chain_id: chainId
    });
    return response.data;
  }
}
