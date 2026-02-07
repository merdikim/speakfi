const Transcript = ({ transcript }: { transcript: string }) => {
  return (
      <div>
        {transcript && (
          <div className="w-full">
            <div className=" p-4">
              <p className="text-sm text-gray-500 mb-2">You said:</p>
              <p className="text-sm text-gray-800">{transcript}</p>
            </div>
          </div>
        )}
      </div>
  )
}

export default Transcript
