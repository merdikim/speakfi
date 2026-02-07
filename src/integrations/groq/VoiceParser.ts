import type { RoutesRequest } from '@lifi/sdk'
import { Groq } from 'groq-sdk'

const DEFI_PARSER_SYSTEM_PROMPT = `You are a DeFi transaction parser. Your job is to convert natural language voice commands into structured transaction plans.

Supported chains: Base, Optimism, Arbitrum, Polygon, Ethereum
Supported operations:
- Bridge: Move tokens between chains
- Swap: Exchange one token for another 
- Transfer: Send tokens to another address

When parsing commands, return a JSON object with this structure:
{
  "fromChainId": "ChainId enum value",
  "toChainId": "ChainId enum value",
  "fromTokenAddress": "token contract address",
  "toTokenAddress": "token contract address",
  "fromAmount": "amount as string",
  "fromAddress": "user's wallet address"
}

Token Address References (for USDC) and Chain IDs:
const chains = {
  base: {
    chainId: 8453,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  optimism: {
    chainId: 10,
    tokenAddress: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  },
  arbitrum: {
    chainId: 42161,
    tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
  polygon: {
    chainId: 137,
    tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  },
  ethereum: {
    chainId: 1,
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
}


Only return valid JSON. Do not include any markdown formatting or explanatory text. If the command cannot be parsed, return an empty JSON object: {}.`

class VoiceCommandParser {
  private groq: Groq

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
  }

  async parseCommand(voiceCommand: string): Promise<RoutesRequest> {
    try {
      const response = await this.groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        max_tokens: 2000,
        messages: [
          {
            role: 'system',
            content: DEFI_PARSER_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Parse this DeFi voice command into a transaction plan: "${voiceCommand}"   
              Return only valid JSON, no markdown or explanation.`,
          },
        ],
      })

      const transactionString = response.choices[0].message.content || ''
      const transaction = JSON.parse(transactionString) as RoutesRequest

      return transaction
    } catch (error) {
      console.error('Error parsing voice command:', error)
      throw new Error('Failed to parse voice command. Please try again.')
    }
  }
}

export { VoiceCommandParser }
