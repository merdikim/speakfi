import { VoiceCommandParser } from '@/integrations/groq/VoiceParser'
import { getBridgeRoutes } from '@/integrations/lifi'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

const useVoiceCommand = (audioCommand: string) => {
  const voiceCommandParser = new VoiceCommandParser(
    import.meta.env.VITE_GROQ_API_KEY || '',
  )
  const { address } = useAccount()

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
  } = useQuery({
    queryKey: ['parseCommand', audioCommand],
    queryFn: async () => {
      if (audioCommand.length == 0 || !address) return null
      const result = '' //await voiceCommandParser.parseCommand(audioCommand)
      const quote = await getBridgeRoutes({ address })

      return result as unknown as DeFiTransaction
    },
    enabled: !!audioCommand && !!address,
  })

  return { transaction, isTransactionLoading, isTransactionError }
}

export default useVoiceCommand
