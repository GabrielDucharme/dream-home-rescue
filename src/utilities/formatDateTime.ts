type DateTimeOptions = {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  weekday?: 'long' | 'short' | 'narrow';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'long' | 'short';
};

interface FormatDateTimeArgs {
  date: Date;
  options?: DateTimeOptions;
  locale?: string;
}

// Modern implementation that supports Intl.DateTimeFormat
export const formatDateTime = ({
  date, 
  options = { 
    year: 'numeric', 
    month: 'numeric',
    day: 'numeric', 
  },
  locale = 'fr-CA'
}: FormatDateTimeArgs): string => {
  try {
    // Use Intl.DateTimeFormat for localized date formatting
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    
    // Fallback to a simple formatting if Intl fails
    const months = date.getMonth();
    const days = date.getDate();
    const YYYY = date.getFullYear();
    const MM = months + 1 < 10 ? `0${months + 1}` : months + 1;
    const DD = days < 10 ? `0${days}` : days;
    
    return `${MM}/${DD}/${YYYY}`;
  }
};

// Legacy version for compatibility with existing code that passes a string
export const formatDateTimeString = (timestamp: string): string => {
  const now = new Date();
  let date = now;
  if (timestamp) date = new Date(timestamp);
  
  return formatDateTime({ date });
};
