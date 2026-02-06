import { chains } from '@/utils'
import React from 'react'
import { useChainId } from 'wagmi'

const useChain = () => {
  const chainId = useChainId()
  const [chain, setChain] = React.useState(chains.ethereum)
  console.log(chainId)

  return { chain }
}

export default useChain
