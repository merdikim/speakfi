import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'

export const Profile = () => {
  const { disconnect } = useDisconnect()

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger className="h-20 w-20">
          <ProfileImage />
        </PopoverTrigger>
        <PopoverContent align="center">
          <PopoverHeader>
            <Button
              className="hover:bg-red-500 cursor-pointer"
              variant="outline"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const ProfileImage = () => {
  const { address } = useAccount()
  const { data: name } = useEnsName({ address, chainId: 1 })
  //@ts-ignore
  const { data: avatar } = useEnsAvatar({ name, chainId: 1 })

  return (
    <div className="flex flex-col items-center gap-6">
      <div className='flex items-center gap-2 cursor-pointer'>
        <img
          src={avatar || 'https://placehold.co/32'}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex flex-col leading-none">
          {name && <span className="font-semibold">{name}</span>}
          {!name && (
            <span className="text-gray-500 text-sm">
              {address?.slice(0, 3)}...{address?.slice(-3)}
            </span>
          )}
        </div>
      </div>

      {!name && (
        <div className="w-[300px] h-10 border rounded-2xl flex items-center justify-center border-gray-200">
          Consider purchasing an ENS name
        </div>
      )}
    </div>
  )
}
