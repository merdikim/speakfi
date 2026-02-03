interface TransactionStep {
  type: 'bridge' | 'swap' | 'deposit' | 'stake' | 'add_liquidity'
  fromChain?: string
  toChain?: string
  fromToken: string
  toToken?: string
  amount: number
  protocol?: string
  status?: 'pending' | 'processing' | 'completed' | 'failed'
}

interface DeFiTransaction {
  steps: TransactionStep[]
  chains: string[]
  risks: string[]
}
