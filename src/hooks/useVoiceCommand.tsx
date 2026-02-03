import { VoiceCommandParser } from '@/integrations/groq/VoiceParser'
import { useQuery } from '@tanstack/react-query'

const useVoiceCommand = (audioCommand: string) => {
  const voiceCommandParser = new VoiceCommandParser(
    import.meta.env.VITE_GROQ_API_KEY || '',
  )

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
  } = useQuery({
    queryKey: ['parseCommand', audioCommand],
    queryFn: async () => {
      if (audioCommand.length == 0) return null

      const result = await voiceCommandParser.parseCommand(audioCommand)

      return result
    },
    enabled: !!audioCommand,
  })

  return { transaction, isTransactionLoading, isTransactionError }
}

export default useVoiceCommand
