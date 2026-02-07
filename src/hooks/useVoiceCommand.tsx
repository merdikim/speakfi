import { VoiceCommandParser } from '@/integrations/groq/VoiceParser'
import { getBridgeRoute } from '@/integrations/lifi'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

const useVoiceCommand = (audioCommand: string) => {
  const voiceCommandParser = new VoiceCommandParser(
    import.meta.env.VITE_GROQ_API_KEY || '',
  )
  const { address } = useAccount()

  const {
    data: transactionDetails,
    isLoading: isTransactionDetailsLoading,
    isError: isTransactionDetailsError,
  } = useQuery({
    queryKey: ['parseCommand', audioCommand],
    queryFn: async () => {
      if (audioCommand.length == 0 || !address) return null
      const command = await voiceCommandParser.parseCommand(audioCommand)
      const bridgeRoute = await getBridgeRoute({command, address })

      return bridgeRoute
    },
    enabled: !!audioCommand && !!address,
  })

  return { transactionDetails, isTransactionDetailsLoading, isTransactionDetailsError }
}

export default useVoiceCommand
