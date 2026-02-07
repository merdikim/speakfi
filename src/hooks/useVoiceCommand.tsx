import { VoiceCommandParser } from '@/integrations/groq/VoiceParser'
import { executeSelectedRoute, getBridgeRoute } from '@/integrations/lifi'
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
      const command = await voiceCommandParser.parseCommand(audioCommand)
      const bridgeRoute = await getBridgeRoute({command, address })
      console.log(bridgeRoute)
      //const res = await executeSelectedRoute({ route: bridgeRoute })

      return ''// bridgeRoute
    },
    enabled: !!audioCommand && !!address,
  })

  return { transaction, isTransactionLoading, isTransactionError }
}

export default useVoiceCommand
