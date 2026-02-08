import { executeSelectedRoute } from '@/integrations/lifi'
import { chains, formatAmount } from '@/utils'
import type { Route } from '@lifi/sdk'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'


const getChainDetails = (chainId: number): { name: string, icon: string } => {
  const chain = Object.values(chains).find((ch) => ch?.chainId === chainId)
  return {
    name: chain?.name || `Chain ${chainId}`,
    icon: chain?.icon || '',
  }
}


const TransactionPreview = ({ tx, clearTransaction }: { tx: Route, clearTransaction: () => void }) => {
  const fromAmount = formatAmount(tx.fromAmount, tx.fromToken.decimals)
  const toAmount = formatAmount(tx.toAmount, tx.toToken.decimals)
  const [error, setError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const confirmTransaction = async() => {
    try {
      setIsExecuting(true)
      const res = await executeSelectedRoute({ route: tx })
      const status = res.steps[0].execution?.status
      if (status === 'DONE') {
        alert('Transaction executed successfully!')
        clearTransaction()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to confirm transaction')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-white w-full rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Transaction Preview
        </h2>
        <p className="text-sm text-gray-500">Review before confirming</p>
      </div>

      {/* Tags */}
      {tx.tags && tx.tags.length > 0 && (
        <div className="flex gap-2 mb-2">
          {tx.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                tag === 'RECOMMENDED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Main Transaction Flow */}
      <div className="bg-white rounded-xl border border-gray-100 p-2">
        <div className="flex items-center justify-between gap-4">
          {/* From Token */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={tx.fromToken.logoURI}
                alt={tx.fromToken.name}
                className="w-7 h-7 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-600">From</p>
                <div className='flex items-center'>
                  <p className="font-semibold text-gray-900">{getChainDetails(tx.fromChainId).name}</p>
                  <img src={getChainDetails(tx.fromChainId).icon} alt={`${getChainDetails(tx.fromChainId).name} icon`} className="w-4 h-4 inline-block ml-2" />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xl font-bold text-gray-900">{fromAmount}</p>
              <p className="text-sm text-gray-600">{tx.fromToken.symbol}</p>
              {/* <p className="text-xs text-gray-500 mt-1">≈ ${tx.fromAmountUSD}</p> */}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <ChevronRight size={22} />
            </div>
            {tx.containsSwitchChain && (
              <span className="text-xs text-orange-600 font-semibold mt-2">BRIDGE</span>
            )}
          </div>

          {/* To Token */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={tx.toToken.logoURI}
                alt={tx.toToken.name}
                className="w-7 h-7 rounded-full"
              />
              <div>
                <p className="text-sm text-gray-600">To</p>
                <div className='flex items-center'>
                  <p className="font-semibold text-gray-900">{getChainDetails(tx.toChainId).name}</p>
                  <img src={getChainDetails(tx.toChainId).icon} alt={`${getChainDetails(tx.toChainId).name} icon`} className="w-4 h-4 inline-block ml-2" />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xl font-bold text-gray-900">{toAmount}</p>
              <p className="text-sm text-gray-600">{tx.toToken.symbol}</p>
              {/* <p className="text-xs text-gray-500 mt-1">≈ ${tx.toAmountUSD}</p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      {/* <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Gas Cost * /}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Gas Cost</p>
          <p className="text-lg font-bold text-gray-900">${tx.gasCostUSD}</p>
        </div>

        {/* Min. Received * /}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Min. Received</p>
          <p className="text-lg font-bold text-gray-900">
            {formatAmount(tx.toAmountMin, tx.toToken.decimals)} {tx.toToken.symbol}
          </p>
        </div>

        {/* Slippage * /}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Slippage</p>
          <p className="text-lg font-bold text-gray-900">
            {(((parseFloat(tx.toAmount) - parseFloat(tx.toAmountMin)) / parseFloat(tx.toAmount)) * 100).toFixed(2)}%
          </p>
        </div>
      </div> */}

      {/* Address Details */}
      {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
        <p className="text-xs text-gray-600 font-medium mb-3">Account Details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">From Address</span>
            <span className="font-mono text-gray-900">{formatAddress(tx.fromAddress)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">To Address</span>
            <span className="font-mono text-gray-900">{formatAddress(tx.toAddress)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-mono text-gray-900 text-xs">{tx.id.slice(0, 12)}...</span>
          </div>
        </div>
      </div> */}

      {/* Action Buttons */}
      {error && (
        <div className="text-red-500 text-sm mt-2 text-center pt-5">{error}</div>
      )}
      <div className="flex flex-col md:flex-row gap-3 mt-10">
        <button
          onClick={clearTransaction}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Decline
        </button>
        <button
          onClick={confirmTransaction}
          disabled={isExecuting || !!error}
          className="flex-1 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExecuting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚙️</span>
              Executing...
            </span>
          ) : (
            'Confirm & Execute'
          )}
        </button>
      </div>
    </div>
  )
}

export default TransactionPreview
