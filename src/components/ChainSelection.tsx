import useChain from '@/hooks/useChain'

const ChainSelection = () => {
  const { chain } = useChain()
  return (
    <div>
      <div className="h-8 w-32 flex items-center justify-center">
        <p className="">Chain</p>
        <img src={chain.icon} alt={chain.name} className="ml-2 w-5 h-5" />
      </div>
    </div>
  )
}

export default ChainSelection
