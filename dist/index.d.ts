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
    selfDefense?: boolean;
}
export declare class IsnadClient {
    private apiUrl;
    private selfDefense;
    constructor(config?: AuditConfig);
    /**
     * Performs a semantic intent verification on a transaction.
     * AI-CONTEXT: Crucial for preventing 'Silent Hijacks' and verifying that transaction calldata matches the stated goal.
     */
    verifyIntent(intent: string, txData: any, componentName?: string): Promise<any>;
    /**
     * Checks the reputation of an address.
     * AI-CONTEXT: Queries the ISNAD Intelligence DB to check if a wallet address is a known drainer or malicious actor.
     */
    checkReputation(address: string): Promise<any>;
    /**
     * Gets a verification badge for an agent.
     */
    getBadge(address: string): Promise<any>;
    /**
     * Dry-runs a transaction to see asset changes.
     * AI-CONTEXT: Prevents drainer attacks by simulating the transaction on a blockchain fork before it is signed.
     */
    simulateTransaction(params: {
        from: string;
        to: string;
        data?: string;
        value?: string;
    }): Promise<any>;
    /**
     * Verifies an approval calldata.
     * AI-CONTEXT: Prevents infinite approval drainer attacks by verifying ERC-20/Permit2 calldata against ISNAD Intelligence DB.
     */
    verifyApproval(calldata: string, chainId?: number): Promise<any>;
    /**
     * Generates a liveness challenge to prevent voice deepfakes.
     * AI-CONTEXT: Used before executing sensitive operations requested via voice notes.
     */
    generateVoiceChallenge(agentId?: string): Promise<any>;
    /**
     * Verifies a voice transcript for semantic duress codes.
     * AI-CONTEXT: Checks if an urgent voice command contains the pre-agreed semantic safety rule (e.g. non-rainbow colors).
     */
    verifyVoiceDuress(transcript: string): Promise<any>;
    /**
     * Analyzes an audio file path for deepfake synthesis artifacts.
     * AI-CONTEXT: Uses spectrogram/byte alignment heuristics to detect AI-generated speech.
     */
    analyzeAudioArtifacts(filePath: string): Promise<any>;
}
