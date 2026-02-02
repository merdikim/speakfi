import { MicOff, Mic, Loader } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TransactionStep {
  type: 'bridge' | 'swap' | 'deposit' | 'stake' | 'add_liquidity'
  fromChain?: string
  toChain?: string
  fromToken: string
  toToken?: string
  amount: number
  protocol?: string
  estimatedGas: number
  estimatedTime: number
  status?: 'pending' | 'processing' | 'completed' | 'failed'
}

interface DeFiTransaction {
  steps: TransactionStep[]
  totalEstimatedCost: number
  totalEstimatedTime: number
  chains: string[]
  risks: string[]
}

const VoiceInput = ({ setTranscript }: { setTranscript: (transcript: string) => void}) => {
  const [isListening, setIsListening] = useState(false)
  const [transaction, setTransaction] = useState<DeFiTransaction | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const recognitionRef = useRef<any>(null)

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('')
      setTransaction(null)
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript
        setTranscript(transcriptText)

        if (event.results[current].isFinal) {
          console.log('Final transcript:', transcriptText)
          //handleVoiceCommand(transcriptText);
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  return (
    <div className="bg-white max-w-2xl w-full rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col items-center">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing || isExecuting}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          } disabled:opacity-50 shadow-xl`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>

        <p className="mt-6 text-gray-600 text-center">
          {isListening
            ? 'Listening... Speak your command'
            : 'Click the microphone to start'}
        </p>
      </div>
    </div>
  )
}

export default VoiceInput
