// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  INVESTOR: 'investor',
  INNOVATOR: 'innovator'
};

// Application Settings
export const APP_NAME = 'Innovest';
export const APP_DESCRIPTION = 'Connecting Investors and Innovators';

// Form Validation
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  BIO_MAX_LENGTH: 500
};

// Status Constants
export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};