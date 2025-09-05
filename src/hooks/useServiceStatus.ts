import { useState, useEffect } from 'react';
import { Service, ServiceStatus } from '../types/service';

export function useServiceStatus(service: Service) {
  const [status, setStatus] = useState<ServiceStatus>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setStatus('checking');
        
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 5000);
        });

        // Try to ping the service with timeout
        const fetchPromise = fetch(service.url, { 
          method: 'HEAD',
          mode: 'no-cors' // This prevents CORS issues but limits response info
        });

        await Promise.race([fetchPromise, timeoutPromise]);
        setStatus('online');
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, [service.url]);

  return status;
}