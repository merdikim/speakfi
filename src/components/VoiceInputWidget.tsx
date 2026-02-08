import { CloudAlert, Loader, Mic, MicOff } from 'lucide-react'

type VoiceInputWidgetProps = {
  isLoaded: boolean
  isRecording: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
  clear: () => void
  error: Error | null
}

const VoiceInputWidget = ({
  isLoaded,
  isRecording,
  startRecording,
  stopRecording,
  clear,
  error
}: VoiceInputWidgetProps) => {
  const start = async () => {
    if (isLoaded) {
      clear()
      await startRecording()
    }
  }

  const stop = async () => {
    if (isRecording) {
      await stopRecording()
    }
  }

  return (
    <div className="bg-white min-h-30 lg:min-h-50 flex flex-col justify-center w-full rounded-2xl shadow-lg px-8 border border-gray-100">
      <div className="flex flex-col items-center gap-2 lg:gap-4">
        <button
          onClick={isRecording ? stop : start}
          disabled={!isLoaded || !!error}
          className={`h-10 w-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600'
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-xl`}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4 lg:w-8 lg:h-8 text-white" />
          ) : (
            <Mic className="h-4 w-4 lg:w-8 lg:h-8 text-white" />
          )}
        </button>

        {isLoaded && (
          <p className=" text-gray-600 text-center text-sm lg:text-base">
            {isRecording
              ? 'Recording... Speak your command'
              : 'Click the microphone to start'}
          </p>
        )}

        {!isLoaded && error && (
          <div className="mt-4 text-sm text-red-500 text-center">
            <CloudAlert className="inline mr-2" /> Error loading voice recognition model: {error?.message || 'Unknown error'}
          </div>
        )}

        {!isLoaded && !error && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            <Loader className="inline mr-2 animate-spin" /> Loading voice
            recognition model...
          </div>
        )}
      </div>
    </div>
  )
}
export default VoiceInputWidget
