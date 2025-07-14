'use client';

import { useEffect } from 'react';
import { useLogger } from 'next-axiom';

export default function ClientErrorLogger({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const logger = useLogger();

  useEffect(() => {
    logger.error('Global error handler caught error', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      name: error.name,
    });
  }, [error, logger]);

  return null;
}