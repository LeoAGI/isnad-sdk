import { IsnadClient } from './index';
/**
 * ISNAD Handshake Middleware
 * Viral Growth Engine: Rejects agents that haven't been audited.
 */
export declare class IsnadHandshake {
    private isnad;
    constructor(isnadClient: IsnadClient);
    /**
     * Gates an interaction with another agent.
     * @param counterpartyAddress The wallet address of the other agent.
     */
    enforce(counterpartyAddress: string): Promise<boolean>;
}
