import { useEffect, useState } from "react";
import { getQueue } from "src/services/common";

export function useQueue() {
  const [queue, setQueue] = useState(0);

  async function queryQueue() {
    try {
      const queue = await getQueue();
      setQueue(queue.pending_tx);
    } catch (e) {
      /** do nothing if fail */
    }
  }

  useEffect(() => {
    queryQueue();
    const queueInterval = setInterval(async () => {
      queryQueue();
    }, 60000);
    return () => clearInterval(queueInterval);
  }, []);

  return queue;
}
