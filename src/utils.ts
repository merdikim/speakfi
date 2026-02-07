export const chains = {
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    symbol: 'ETH',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    symbol: 'MATIC',
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    symbol: 'ETH',
    icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png',
  },
  base: {
    name: 'Base',
    chainId: 8453,
    symbol: 'ETH',
    icon: 'https://cryptologos.cc/logos/base-base-logo.png',
  },
}

export const formatAddress = (address: string, length: number = 4): string => {
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export const formatAmount = (amount: string, decimals: number): string => {
  const num = parseFloat(amount) / Math.pow(10, decimals)
  return num.toFixed(2)
}
