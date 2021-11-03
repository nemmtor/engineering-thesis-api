// https://develop.sentry.dev/sdk/event-payloads/span/

export const toSentryStatus = {
  '400': 'invalid_argument',
  '401': 'unauthenticated',
  '403': 'permission_denied',
  '404': 'not_found',
  '409': 'already_exists',
  '429': 'resource_exhausted',
  '499': 'cancelled',
  '500': 'internal_error',
  '501': 'unimplemented',
  '503': 'unavailable',
  '504': 'deadline_exceeded',
};

export const httpCodeToSentryStatus = (httpCode: number): string => {
  if (httpCode >= 200 && httpCode < 400) {
    return 'ok';
  }
  return toSentryStatus[httpCode] || 'unknown';
};
