import React, { useEffect } from 'react'
import useVoiceCommand from '@/hooks/useVoiceCommand'
import { cn } from '@/lib/utils'
import { Profile } from './Profile'
import VoiceInputWidget from './VoiceInputWidget'
import { useLeopard } from '@picovoice/leopard-react'
import Transcript from './Transcript'
import TransactionLoading from './skeletons/TransactionLoading'

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
  const { transaction, isTransactionLoading, isTransactionError } =
    useVoiceCommand(result?.transcript || '')

  const isTransactionValid =
    transaction && transaction.steps && transaction.steps.length > 0

  // const executeTransaction = async () => {
  //   if (!transaction) return
  //   setIsExecuting(true)

  //   try {
  //     const updatedSteps = transaction.steps.map((step) => ({
  //       ...step,
  //       status: 'pending' as const,
  //     }))

  //     setTransaction({ ...transaction, steps: updatedSteps })

  //     for (let i = 0; i < updatedSteps.length; i++) {
  //       updatedSteps[i].status = 'processing'
  //       setTransaction({ ...transaction, steps: [...updatedSteps] })
  //       await new Promise((resolve) => setTimeout(resolve, 2000))
  //       updatedSteps[i].status = 'completed'
  //       setTransaction({ ...transaction, steps: [...updatedSteps] })
  //     }

  //     alert('Transaction completed successfully! 🎉')
  //   } catch (error) {
  //     console.error('Error executing transaction:', error)
  //     alert('Transaction failed. Please try again.')
  //   } finally {
  //     setIsExecuting(false)
  //   }
  // }

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
          isTransactionValid ||
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
        <div>{isTransactionLoading && <TransactionLoading />}</div>

        {isTransactionValid && (
          <div className="bg-white w-full rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Transaction Preview
            </h2>

            <div className="space-y-4 mb-6">
              {transaction.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="grow">
                    <p className="font-medium text-gray-800">
                      {step.type}: {step.amount} {step.fromToken}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                //onClick={() => setTransaction(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                //onClick={executeTransaction}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg"
              >
                Confirm & Execute
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
