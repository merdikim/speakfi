// Voice Command Parser for Cross-Chain DeFi Operations
// This parser uses AI (OpenAI/Claude) to understand complex multi-step DeFi commands

import Anthropic from '@anthropic-ai/sdk'

// Define the structure of a parsed transaction
interface DeFiTransaction {
  steps: TransactionStep[]
  totalEstimatedCost: number
  totalEstimatedTime: number
  chains: string[]
  risks: string[]
}

interface TransactionStep {
  type: 'bridge' | 'swap' | 'deposit' | 'stake' | 'withdraw' | 'add_liquidity'
  fromChain?: string
  toChain?: string
  fromToken: string
  toToken?: string
  amount: number
  protocol?: string
  estimatedGas: number
  estimatedTime: number
}

// System prompt for the AI to understand DeFi commands
const DEFI_PARSER_SYSTEM_PROMPT = `You are a DeFi transaction parser. Your job is to convert natural language voice commands into structured transaction plans.

Supported chains: Ethereum, Polygon, Arbitrum, Optimism, Sui
Supported operations:
- Bridge: Move tokens between chains
- Swap: Exchange one token for another
- Deposit: Put tokens into a vault or pool
- Stake: Lock tokens for rewards
- Add Liquidity: Provide liquidity to a DEX pool

When parsing commands, return a JSON object with this structure:
{
  "steps": [
    {
      "type": "bridge|swap|deposit|stake|add_liquidity",
      "fromChain": "chain name",
      "toChain": "chain name",
      "fromToken": "token symbol",
      "toToken": "token symbol (if applicable)",
      "amount": number,
      "protocol": "specific protocol if mentioned",
      "estimatedGas": estimated_gas_in_usd,
      "estimatedTime": estimated_time_in_minutes
    }
  ],
  "chains": ["list of chains involved"],
  "risks": ["list of potential risks or warnings"]
}

Be conservative with gas estimates. Add warnings for:
- Large transactions (>$1000)
- High slippage potential
- Multiple chain hops
- Unaudited protocols`

class VoiceCommandParser {
  private anthropic: Anthropic

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey })
  }

  /**
   * Parse a voice command into a structured transaction plan
   */
  async parseCommand(voiceCommand: string): Promise<DeFiTransaction> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: DEFI_PARSER_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Parse this DeFi voice command into a transaction plan: "${voiceCommand}"
            
Return only valid JSON, no markdown or explanation.`,
          },
        ],
      })

      // Extract the JSON from the response
      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type')
      }

      const jsonText = content.text.trim()
      const parsed = JSON.parse(jsonText)

      // Calculate totals
      const totalEstimatedCost = parsed.steps.reduce(
        (sum: number, step: TransactionStep) => sum + step.estimatedGas,
        0,
      )
      const totalEstimatedTime = Math.max(
        ...parsed.steps.map((step: TransactionStep) => step.estimatedTime),
      )

      return {
        ...parsed,
        totalEstimatedCost,
        totalEstimatedTime,
      }
    } catch (error) {
      console.error('Error parsing voice command:', error)
      throw new Error('Failed to parse voice command. Please try again.')
    }
  }

  /**
   * Generate a human-readable summary of the transaction
   */
  generateSummary(transaction: DeFiTransaction): string {
    const stepDescriptions = transaction.steps.map((step, index) => {
      switch (step.type) {
        case 'bridge':
          return `${index + 1}. Bridge ${step.amount} ${step.fromToken} from ${step.fromChain} to ${step.toChain}`
        case 'swap':
          return `${index + 1}. Swap ${step.amount} ${step.fromToken} for ${step.toToken}`
        case 'deposit':
          return `${index + 1}. Deposit ${step.amount} ${step.fromToken} into ${step.protocol || 'vault'}`
        case 'stake':
          return `${index + 1}. Stake ${step.amount} ${step.fromToken}`
        case 'add_liquidity':
          return `${index + 1}. Add ${step.amount} ${step.fromToken} to liquidity pool`
        default:
          return `${index + 1}. ${step.type} ${step.amount} ${step.fromToken}`
      }
    })

    return `
Transaction Summary:
${stepDescriptions.join('\n')}

Estimated Cost: $${transaction.totalEstimatedCost.toFixed(2)}
Estimated Time: ${transaction.totalEstimatedTime} minutes
Chains: ${transaction.chains.join(', ')}
${transaction.risks.length > 0 ? `\nWarnings:\n${transaction.risks.map((r) => `⚠️ ${r}`).join('\n')}` : ''}
    `.trim()
  }
}

// Export for use in the application
export { VoiceCommandParser, DeFiTransaction, TransactionStep }
