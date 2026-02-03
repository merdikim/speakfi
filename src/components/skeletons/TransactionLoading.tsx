const TransactionLoading = () => {
  return (
    <div className="bg-white w-full rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Transaction Preview
      </h2>

      <div className="space-y-4 mb-6">
        {Array(3)
          .fill('')
          .map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                {index + 1}
              </div>
              <div className="grow">
                <p className="animate-pulse bg-gray-300 rounded-lg h-6 w-full"></p>
              </div>
            </div>
          ))}
      </div>

      <div className="flex gap-4">
        <button
          disabled
          className="flex-1 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          disabled
          className="flex-1 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg"
        >
          Confirm & Execute
        </button>
      </div>
    </div>
  )
}

export default TransactionLoading
