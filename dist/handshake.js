"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsnadHandshake = void 0;
/**
 * ISNAD Handshake Middleware
 * Viral Growth Engine: Rejects agents that haven't been audited.
 */
class IsnadHandshake {
    isnad;
    constructor(isnadClient) {
        this.isnad = isnadClient;
    }
    /**
     * Gates an interaction with another agent.
     * @param counterpartyAddress The wallet address of the other agent.
     */
    async enforce(counterpartyAddress) {
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
exports.IsnadHandshake = IsnadHandshake;
