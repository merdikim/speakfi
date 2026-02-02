import VoiceInterface from '@/components/VoiceInterface'
import { createFileRoute } from '@tanstack/react-router'
//import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <VoiceInterface />
    </div>
  )
}
