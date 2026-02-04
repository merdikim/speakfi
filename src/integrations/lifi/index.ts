import {
  ChainId,
  type RoutesRequest,
  getRoutes,
  executeRoute,
} from '@lifi/sdk'


export const getBridgeRoutes = async ({ address }: { address: string }) => {
  const routesRequest: RoutesRequest = {
    fromChainId: ChainId.ETH,
    toChainId: ChainId.BAS,
    fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
    toTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    fromAmount: '10000000', // 10 USDC
    fromAddress: address, // User's address
  }

  try {
    const { routes } = await getRoutes(routesRequest)
    const route = routes[0]

    const executedRoute = await executeRoute(route, {
      updateRouteHook(route) {
        console.log(route)
      },
    })
    console.log(executedRoute)
  } catch (error) {
    console.log(error)
  }
}
