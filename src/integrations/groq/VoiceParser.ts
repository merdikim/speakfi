import { Groq } from 'groq-sdk'

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
      "protocol": "specific protocol if mentioned"
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
  private groq: Groq

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey, dangerouslyAllowBrowser: true })
  }

  async parseCommand(voiceCommand: string): Promise<DeFiTransaction> {
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

      const transactionString = response.choices[0].message.content || "";
      const transaction = JSON.parse(transactionString) as DeFiTransaction

      return transaction
    } catch (error) {
      console.error('Error parsing voice command:', error)
      throw new Error('Failed to parse voice command. Please try again.')
    }
  }

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
Chains: ${transaction.chains.join(', ')}
${transaction.risks.length > 0 ? `\nWarnings:\n${transaction.risks.map((r) => `⚠️ ${r}`).join('\n')}` : ''}
    `.trim()
  }
}

export { VoiceCommandParser }
