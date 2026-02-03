import React, { useState } from 'react'
import VoiceInput from './VoiceInput'
import useVoiceCommand from '@/hooks/useVoiceCommand'
import { cn } from '@/lib/utils'
import TransactionLoading from './skeletons/TransactionLoading'
import { useDisconnect } from 'wagmi'

const VoiceDeFiInterface: React.FC = () => {
  const [transcript, setTranscript] = useState('')
  const [audioCommand, setAudioCommand] = useState('')
  const { transaction, isTransactionLoading, isTransactionError } =
    useVoiceCommand(audioCommand)
  const { disconnect } = useDisconnect()

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

  return (
    <div className="h-full w-full flex flex-col items-center p-8">
      <button onClick={() => disconnect()}>Disconnect</button>

      <div
        className={cn(
          isTransactionValid && !isTransactionLoading
            ? 'justify-start'
            : 'justify-center',
          'h-full transition-all ease-in-out space-y-2 max-w-2xl w-full flex flex-col items-center',
        )}
      >
        <VoiceInput
          setTranscript={setTranscript}
          setAudioCommand={setAudioCommand}
          isProcessing={false}
        />

        <div>
          {/* {transcript && (
            <div className="mt-6 w-full">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">You said:</p>
                <p className="text-lg text-gray-800">{transcript}</p>
              </div>
            </div>
          )} */}
        </div>
        {isTransactionLoading && <TransactionLoading />}

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

export default VoiceDeFiInterface
