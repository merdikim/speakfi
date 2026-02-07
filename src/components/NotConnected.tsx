import Squares from '@/components/Squares'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const NotConnected = () => {
  const { openConnectModal } = useConnectModal()

  return (
    <div className="relative h-full w-full">
      <Squares
        speed={0.1}
        squareSize={10}
        direction="diagonal"
        borderColor="#fff"
        hoverFillColor="#fff"
      />
      <div className="absolute inset-0 h-full w-full bg-transparent flex flex-col items-center justify-center">
        <div className="text-center mb-2">
          <h1 className="text-black text-2xl font-semibold mb-4">
            Speak once. We handle the chains.
          </h1>
        </div>
        <div className="h-64 max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-lg">
            Please connect your wallet to use the voice interface.
          </p>
          <button
            onClick={openConnectModal}
            className="mt-4 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotConnected
