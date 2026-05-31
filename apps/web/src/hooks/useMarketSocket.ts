import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMarketStore } from '../store/marketStore';

let socket: Socket | null = null;

export function useMarketSocket() {
  const setSnapshot = useMarketStore((state) => state.setSnapshot);
  const setLiveUpdate = useMarketStore((state) => state.setLiveUpdate);

  useEffect(() => {
    if (!socket) {
      socket = io(
        import.meta.env.VITE_API_URL?.replace('/api', '') ||
          'http://localhost:8080',
        {
          transports: ['websocket'],
        }
      );
    }

    socket.on('market:snapshot', setSnapshot);
    socket.on('market:update', setLiveUpdate);
    socket.on('watchlist:update', setLiveUpdate);

    return () => {
      socket?.off('market:snapshot', setSnapshot);
      socket?.off('market:update', setLiveUpdate);
      socket?.off('watchlist:update', setLiveUpdate);
    };
  }, [setSnapshot, setLiveUpdate]);
}
