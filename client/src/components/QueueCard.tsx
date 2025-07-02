import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueueInfo } from "@/types";

interface QueueCardProps {
  queueInfo: QueueInfo;
}

export function QueueCard({ queueInfo }: QueueCardProps) {
  const queueName = queueInfo.url.split('/').pop() || 'Unknown Queue';
  
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-mono break-all">{queueName}</CardTitle>
        <p className="text-sm text-muted-foreground font-mono break-all">
          {queueInfo.url}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Messages:</span>
            <span className="font-mono">
              {queueInfo.attributes.ApproximateNumberOfMessages || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Not Visible:</span>
            <span className="font-mono">
              {queueInfo.attributes.ApproximateNumberOfMessagesNotVisible || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delayed:</span>
            <span className="font-mono">
              {queueInfo.attributes.ApproximateNumberOfMessagesDelayed || 0}
            </span>
          </div>
        </div>
        
        {queueInfo.messages && queueInfo.messages.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Messages (peeked)</h4>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-64 whitespace-pre-wrap">
              {JSON.stringify(queueInfo.messages, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}