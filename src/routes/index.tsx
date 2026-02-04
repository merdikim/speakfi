import NotConnected from '@/components/NotConnected'
import VoiceInterface from '@/components/VoiceInterface'
import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      {isConnected ? <VoiceInterface /> : <NotConnected />}
    </div>
  )
}
