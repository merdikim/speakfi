import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatAddress } from '@/utils'
import type { GetEnsAvatarReturnType, GetEnsNameReturnType } from 'viem'

export const Profile = () => {
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const { data: name } = useEnsName({ address, chainId: 1 })
  //@ts-ignore
  const { data: avatar } = useEnsAvatar({ name, chainId: 1 })

  return (
    <div className="flex flex-col items-center gap-4">
      <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full hover:opacity-80 transition-opacity">
        <ProfileImage name={name} avatar={avatar} address={address} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-75">
        <Button
        className="w-full"
        variant="outline"
        onClick={() => disconnect()}
        >
        Disconnect
        </Button>
      </PopoverContent>
      </Popover>
      {!name && (
      <a 
        href="https://app.ens.domains/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-75 text-center text-sm text-blue-600 hover:underline"
      > 
        Get an ENS name to simplify sending transactions
      </a>
      )}
    </div>
  )
}

const ProfileImage = ({ name, avatar, address }: { name?: GetEnsNameReturnType; avatar?: GetEnsAvatarReturnType; address?: string }) => {

  return (
      <div className="flex items-center gap-2 cursor-pointer">
        <img
          src={avatar || 'https://placehold.co/32'}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col leading-none">
          {name && <span className="font-semibold">{name}</span>}
          {!name && (
            <span className="text-gray-500 text-sm">
              {formatAddress(address || '', 3)}
            </span>
          )}
        </div>
      </div>
  )
}
