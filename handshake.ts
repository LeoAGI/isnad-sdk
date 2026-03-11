import { IsnadClient } from './index';

/**
 * ISNAD Handshake Middleware
 * Viral Growth Engine: Rejects agents that haven't been audited.
 */
export class IsnadHandshake {
  private isnad: IsnadClient;

  constructor(isnadClient: IsnadClient) {
    this.isnad = isnadClient;
  }

  /**
   * Gates an interaction with another agent.
   * @param counterpartyAddress The wallet address of the other agent.
   */
  async enforce(counterpartyAddress: string) {
    console.log(`[ISNAD] Enforcing handshake for ${counterpartyAddress}...`);
    
    const reputation = await this.isnad.checkReputation(counterpartyAddress);
    
    if (reputation.status === "flagged") {
      throw new Error(`ISNAD_REJECTED: Counterparty ${counterpartyAddress} is blacklisted. Reason: ${reputation.reason}`);
    }

    if (reputation.score > 50) {
      throw new Error(`ISNAD_REJECTED: Counterparty risk score too high (${reputation.score}).`);
    }

    console.log(`✅ ISNAD Handshake successful for ${counterpartyAddress}.`);
    return true;
  }
}
