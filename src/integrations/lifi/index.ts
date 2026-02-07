import {
  type RoutesRequest,
  type Route,
  getRoutes,
  executeRoute,
} from '@lifi/sdk'

export const getBridgeRoute = async ({
  command,
  address,
}: {
  command: RoutesRequest
  address: string
}): Promise<Route> => {
  const routesRequest = {
    fromChainId: command.fromChainId,
    toChainId: command.toChainId,
    fromTokenAddress: command.fromTokenAddress,
    toTokenAddress: command.toTokenAddress,
    fromAmount: String(Number(command.fromAmount) * 10 ** 6),
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
