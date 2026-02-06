import {
  ChainId,
  type RoutesRequest,
  type Route,
  getRoutes,
  executeRoute,
} from '@lifi/sdk'

export const getBridgeRoute = async ({
  address,
}: {
  address: string
}): Promise<Route> => {
  const routesRequest: RoutesRequest = {
    fromChainId: ChainId.BAS,
    toChainId: ChainId.SUI,
    fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    toTokenAddress:
      '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC', // USDC on Sui
    fromAmount: '1000000', // 1 USDC
    fromAddress: address, // User's address
  }

  try {
    const { routes } = await getRoutes(routesRequest)
    const route = routes[0]
    return route
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch bridge route')
  }
}

export const executeSelectedRoute = async ({ route }: { route: Route }) => {
  try {
    const executedRoute = await executeRoute(route, {
      updateRouteHook(route) {
        console.log('route', route)
      },
    })
    console.log('executedRoute', executedRoute)
  } catch (error) {
    console.log(error)
    throw new Error('Failed to execute the selected route')
  }
}
