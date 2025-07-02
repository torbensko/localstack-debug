export interface QueueMessage {
  MessageId?: string;
  ReceiptHandle?: string;
  MD5OfBody?: string;
  Body?: string;
  Attributes?: Record<string, string>;
  MD5OfMessageAttributes?: string;
  MessageAttributes?: Record<string, any>;
}

export interface QueueInfo {
  url: string;
  attributes: {
    ApproximateNumberOfMessages?: string;
    ApproximateNumberOfMessagesNotVisible?: string;
    ApproximateNumberOfMessagesDelayed?: string;
  };
  messages: QueueMessage[];
}