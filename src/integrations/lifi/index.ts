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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch bridge route')
  }
}

export const executeSelectedRoute = async ({ route }: { route: Route }) => {
  try {
    const executedRoute = await executeRoute(route, {
      updateRouteHook(route) {
        console.log('status', route.steps[0].execution?.status)
        console.log('estimated time in seconds', route.steps[0].estimate.executionDuration)
      },
    })
    return executedRoute
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to execute route')
  }
}
