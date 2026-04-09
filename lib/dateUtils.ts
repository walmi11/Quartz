/**
 * Convert Date to JavaScript Date
 */
export function toDate(value: any): Date {
  if (!value) {
    return new Date();
  }
  
  // If it's a Firestore Timestamp with toDate method
  if (value && typeof value.toDate === 'function') {
    return value.toDate();
  }
  
  // If it's already a Date
  if (value instanceof Date) {
    return value;
  }
  
  // Otherwise try to convert to Date
  return new Date(value);
}

/**
 * Get time in milliseconds from Firestore Timestamp or Date
 */
export function getTime(value: any): number {
  return toDate(value).getTime();
}
