import React, { useState } from 'react'
import VoiceInput from './VoiceInput'

const VoiceDeFiInterface: React.FC = () => {
  const [transcript, setTranscript] = useState('')
  const [transaction, setTransaction] = useState<DeFiTransaction | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const executeTransaction = async () => {
    if (!transaction) return
    setIsExecuting(true)

    try {
      const updatedSteps = transaction.steps.map((step) => ({
        ...step,
        status: 'pending' as const,
      }))

      setTransaction({ ...transaction, steps: updatedSteps })

      for (let i = 0; i < updatedSteps.length; i++) {
        updatedSteps[i].status = 'processing'
        setTransaction({ ...transaction, steps: [...updatedSteps] })
        await new Promise((resolve) => setTimeout(resolve, 2000))
        updatedSteps[i].status = 'completed'
        setTransaction({ ...transaction, steps: [...updatedSteps] })
      }

      alert('Transaction completed successfully! 🎉')
    } catch (error) {
      console.error('Error executing transaction:', error)
      alert('Transaction failed. Please try again.')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/parse-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      })

      const parsedTransaction = await response.json()
      setTransaction(parsedTransaction)
      setHistory((prev) => [command, ...prev.slice(0, 4)])
    } catch (error) {
      console.error('Error parsing command:', error)
      alert('Failed to parse command. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-full w-full p-8">
      {/* <header className="text-center mb-12">
        <p className="text-gray-400 text-sm">
          Speak once. We handle the chains.
        </p>
      </header> */}

      <div className="space-y-6 w-full flex flex-col items-center">
        <VoiceInput setTranscript={setTranscript} />

        <div>
           {transcript && (
          <div className="mt-6 w-full">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">You said:</p>
              <p className="text-lg text-gray-800">{transcript}</p>
            </div>
          </div>
        )}

        {/* {isProcessing && (
          <div className="mt-6 flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-gray-600">Processing your command...</span>
          </div>
        )} */}
        </div>
        {/* Transaction Preview */}
        {transaction && !isExecuting && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Transaction Preview
            </h2>

            <div className="space-y-4 mb-6">
              {transaction.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">
                      {step.type}: {step.amount} {step.fromToken}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>⛽ ${step.estimatedGas.toFixed(2)}</span>
                      <span>⏱️ ~{step.estimatedTime}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${transaction.totalEstimatedCost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Time</p>
                  <p className="text-xl font-bold text-gray-800">
                    {transaction.totalEstimatedTime} min
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={executeTransaction}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg"
              >
                Confirm & Execute
              </button>
              <button
                onClick={() => setTransaction(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Examples Sidebar */}
      {/* <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Example Commands</h3>
              <div className="space-y-3">
                {[
                  'Bridge 1000 USDC from Ethereum to Sui and stake it',
                  'Swap 0.5 ETH for USDC and add to liquidity pool',
                  'Bridge from Polygon to Sui and deposit in highest APY vault'
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleVoiceCommand(example)}
                    disabled={isListening || isProcessing || isExecuting}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors disabled:opacity-50"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div> */}
    </div>
  )
}

export default VoiceDeFiInterface
