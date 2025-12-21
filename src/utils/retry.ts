export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 5,
    baseDelay = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        const isLastAttempt = i === maxRetries - 1;
        const isRpcError = error.code === 'UNKNOWN_ERROR' || 
                          error.code === 'TIMEOUT' ||
                          error.code === 'SERVER_ERROR' ||
                          error.code === 'EAI_AGAIN' ||
                          error.code === -32000 ||
                          error.name === 'AggregateError' ||
                          error.message?.includes('invalid block range') ||
                          error.message?.includes('ECONNREFUSED') ||
                          error.message?.includes('Bad Gateway') ||
                          error.message?.includes('getaddrinfo');
        
        if (isLastAttempt || !isRpcError) {
          throw error;
        }
  
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
        console.warn(`⚠️ RPC error, retrying in ${Math.round(delay)}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Unreachable');
  }