
const SkeletonPill = ({ className = '' }: { className?: string }) => (
  <div className={`inline-block h-6 rounded-full bg-gray-200 ${className}`} />
)

const TransactionPreviewLoading = () => {
  return (
    <div className="bg-linear-to-br from-gray-50 to-white w-full rounded-2xl shadow-lg p-4 md:p-8 border border-gray-200 animate-pulse">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Transaction Preview</h2>
        <p className="text-sm text-gray-500">Review before confirming</p>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <SkeletonPill className="w-24" />
        <SkeletonPill className="w-20" />
        <SkeletonPill className="w-16" />
      </div>

      {/* Main Transaction Flow */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* From Token */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-gray-200" />
              <div className="w-full">
                <p className="text-sm text-gray-400">From</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="h-8 w-36 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-white shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="h-4 w-10 bg-gray-200 rounded mt-2" />
          </div>

          {/* To Token */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-gray-200" />
              <div className="w-full">
                <p className="text-sm text-gray-400">To</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="h-8 w-36 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-3 mt-10">
        <button
          disabled
          className="flex-1 bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-80"
        >
          <div className="h-5 w-24 bg-gray-200 rounded mx-auto" />
        </button>
        <button
          disabled
          className="flex-1 bg-green-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed disabled:opacity-80"
        >
          <div className="h-5 w-44 bg-green-400 rounded mx-auto" />
        </button>
      </div>
    </div>
  )
}

export default TransactionPreviewLoading
