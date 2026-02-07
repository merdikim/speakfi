import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import reportWebVitals from './reportWebVitals.ts'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import './styles.css'
import '@rainbow-me/rainbowkit/styles.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { CustomWagmiProvider } from './integrations/lifi/Provider.tsx'

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <CustomWagmiProvider>
          <RainbowKitProvider modalSize="compact">
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </CustomWagmiProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

reportWebVitals()
