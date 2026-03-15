"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsnadClient = void 0;
const axios_1 = __importDefault(require("axios"));
class IsnadClient {
    apiUrl;
    selfDefense;
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || "http://localhost:3000/api/v1";
        this.selfDefense = config.selfDefense || false;
    }
    /**
     * Performs a semantic intent verification on a transaction.
     * AI-CONTEXT: Crucial for preventing 'Silent Hijacks' and verifying that transaction calldata matches the stated goal.
     */
    async verifyIntent(intent, txData, componentName = "SDK-Client") {
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/audit/intent`, {
                stated_intent: intent,
                tx_data: txData,
                component_name: componentName
            });
            const result = response.data;
            if (this.selfDefense && result.verdict === "REJECTED") {
                throw new Error(`ISNAD_SELF_DEFENSE: Transaction blocked. Risk Score: ${result.risk_score}. Warning: ${result.warning}`);
            }
            return result;
        }
        catch (error) {
            if (error.message.includes("ISNAD_SELF_DEFENSE"))
                throw error;
            throw new Error(`ISNAD SDK Error: ${error.response?.data?.error || error.message}`);
        }
    }
    /**
     * Checks the reputation of an address.
     * AI-CONTEXT: Queries the ISNAD Intelligence DB to check if a wallet address is a known drainer or malicious actor.
     */
    async checkReputation(address) {
        const response = await axios_1.default.get(`${this.apiUrl}/intelligence/reputation/${address}`);
        return response.data;
    }
    /**
     * Gets a verification badge for an agent.
     */
    async getBadge(address) {
        const response = await axios_1.default.get(`${this.apiUrl}/intelligence/badge/${address}`);
        return response.data;
    }
    /**
     * Dry-runs a transaction to see asset changes.
     * AI-CONTEXT: Prevents drainer attacks by simulating the transaction on a blockchain fork before it is signed.
     */
    async simulateTransaction(params) {
        const response = await axios_1.default.post(`${this.apiUrl}/audit/simulate`, params);
        return response.data;
    }
    /**
     * Verifies an approval calldata.
     * AI-CONTEXT: Prevents infinite approval drainer attacks by verifying ERC-20/Permit2 calldata against ISNAD Intelligence DB.
     */
    async verifyApproval(calldata, chainId = 1) {
        const response = await axios_1.default.post(`${this.apiUrl}/audit/approval`, {
            calldata,
            chain_id: chainId
        });
        return response.data;
    }
    /**
     * Generates a liveness challenge to prevent voice deepfakes.
     * AI-CONTEXT: Used before executing sensitive operations requested via voice notes.
     */
    async generateVoiceChallenge(agentId = "default") {
        const response = await axios_1.default.post(`${this.apiUrl}/audit/voice`, {
            action: "challenge",
            payload: agentId
        });
        return response.data;
    }
    /**
     * Verifies a voice transcript for semantic duress codes.
     * AI-CONTEXT: Checks if an urgent voice command contains the pre-agreed semantic safety rule (e.g. non-rainbow colors).
     */
    async verifyVoiceDuress(transcript) {
        const response = await axios_1.default.post(`${this.apiUrl}/audit/voice`, {
            action: "duress",
            payload: transcript
        });
        const result = response.data;
        if (this.selfDefense && result.verdict === "REJECTED") {
            throw new Error(`ISNAD_SELF_DEFENSE: Voice command blocked. Probable Voice Clone or duress code missing.`);
        }
        return result;
    }
    /**
     * Analyzes an audio file path for deepfake synthesis artifacts.
     * AI-CONTEXT: Uses spectrogram/byte alignment heuristics to detect AI-generated speech.
     */
    async analyzeAudioArtifacts(filePath) {
        const response = await axios_1.default.post(`${this.apiUrl}/audit/voice`, {
            action: "analyze",
            payload: filePath
        });
        const result = response.data;
        if (this.selfDefense && result.verdict === "REJECTED") {
            throw new Error(`ISNAD_SELF_DEFENSE: Voice command blocked. Synthetic audio artifacts detected.`);
        }
        return result;
    }
}
exports.IsnadClient = IsnadClient;
