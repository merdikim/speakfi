import React, { useEffect, useState } from 'react'
import useVoiceCommand from '@/hooks/useVoiceCommand'
import { cn } from '@/lib/utils'
import { Profile } from './Profile'
import VoiceInputWidget from './VoiceInputWidget'
import { useLeopard } from '@picovoice/leopard-react'
import Transcript from './Transcript'
import TransactionLoading from './skeletons/TransactionPreviewLoading'
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
  const [audioCommand, setAudioCommand] = useState<string>('')
  const { transactionDetails, transactionDetailsError, isTransactionDetailsLoading, isTransactionDetailsError } =
    useVoiceCommand(audioCommand)

  const isTransactionDetailsValid = !!transactionDetails && !isTransactionDetailsLoading && !isTransactionDetailsError


  const initializeLeopard = async () => {
    try {
      await init(`${ACCESS_KEY}`, leopardModel)
    } catch (err) {
      console.error('Failed to initialize Leopard:', err)
    }
  }


  useEffect(() => {
    if (result?.transcript) {
      setAudioCommand(result.transcript)
    }
  }, [result])

  useEffect(() => {
    initializeLeopard()
    return () => {
      release()
    }
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center p-4 lg:p-8">
      <Profile />
      <div
        className={cn(
          (isTransactionDetailsValid || audioCommand.length > 0)
            ? 'justify-start pt-5 lg:pt-10'
            : 'justify-center',
          'h-full transition-all ease-in-out space-y-2 max-w-2xl w-full flex flex-col items-center',
        )}
      >
        <VoiceInputWidget
          isLoaded={isLoaded}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          clear={() => setAudioCommand('')}
          error={error}
        />
        {!isTransactionDetailsError && <Transcript transcript={audioCommand} />}
        {isTransactionDetailsLoading && <TransactionLoading />}

        { /**@ts-ignore */}
        {isTransactionDetailsValid && <TransactionPreview tx={transactionDetails} clearTransaction={() => setAudioCommand('')} />}
        {isTransactionDetailsError && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            Failed to fetch transaction details. Please try again.
            <br />
            Error: {transactionDetailsError?.message || 'Unknown error'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
