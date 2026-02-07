import React, { useEffect } from 'react'
import useVoiceCommand from '@/hooks/useVoiceCommand'
import { cn } from '@/lib/utils'
import { Profile } from './Profile'
import VoiceInputWidget from './VoiceInputWidget'
import { useLeopard } from '@picovoice/leopard-react'
import Transcript from './Transcript'
import TransactionLoading from './skeletons/TransactionLoading'
import TransactionPreview from './TransactionPreview'

const ACCESS_KEY = import.meta.env.VITE_PICOVOICE_API_KEY || ''
const leopardModel = {
  publicPath: 
    'https://raw.githubusercontent.com/Picovoice/leopard/master/lib/common/leopard_params.pv',
}

const Home: React.FC = () => {
  const {
    result,
    isLoaded,
    error,
    init,
    startRecording,
    stopRecording,
    isRecording,
    release,
  } = useLeopard()
  const { transactionDetails, isTransactionDetailsLoading, isTransactionDetailsError } =
    useVoiceCommand(result?.transcript || '')

  const isTransactionDetailsValid = !!transactionDetails && !isTransactionDetailsLoading && !isTransactionDetailsError


  const initializeLeopard = async () => {
    try {
      await init(`${ACCESS_KEY}`, leopardModel)
    } catch (err) {
      console.error('Failed to initialize Leopard:', err)
    }
  }

  useEffect(() => {
    initializeLeopard()
    return () => {
      release()
    }
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center p-8">
      <Profile />
      <div
        className={cn(
          isTransactionDetailsValid ||
            (result?.transcript && result.transcript.length > 0)
            ? 'justify-start pt-20'
            : 'justify-center',
          'h-full transition-all ease-in-out space-y-2 max-w-2xl w-full flex flex-col items-center',
        )}
      >
        <VoiceInputWidget
          isLoaded={isLoaded}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          error={error}
        />
        <Transcript transcript={result?.transcript || ''} />
        <div>{isTransactionDetailsLoading && <TransactionLoading />}</div>

        { /**@ts-ignore */}
        {isTransactionDetailsValid && <TransactionPreview tx={transactionDetails} />}
      </div>
    </div>
  )
}

export default Home
