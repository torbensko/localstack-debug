import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { QueueCard } from '@/components/QueueCard';
import { QueueInfo } from '@/types';

function App() {
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('update', (payload: QueueInfo[]) => {
      setQueues(payload);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-mono mb-2">
            LocalStack SQS Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {queues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No queues found. Make sure LocalStack is running and has SQS queues created.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {queues.map((queueInfo, index) => (
              <QueueCard key={queueInfo.url || index} queueInfo={queueInfo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;