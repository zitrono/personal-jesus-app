'use client';

import { useEffect } from 'react';
import { useLogger } from 'next-axiom';

export default function ClientSinLogger({
  sin,
}: {
  sin: Error & { digest?: string };
}) {
  const logger = useLogger();

  useEffect(() => {
    logger.error('Global sin handler caught sin', {
      message: sin.message,
      stack: sin.stack,
      digest: sin.digest,
      name: sin.name,
    });
  }, [sin, logger]);

  return null;
}