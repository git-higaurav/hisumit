import { z } from 'zod';

// Reuse validation rules from ContactMessage model for consistency
const validationRules = {
  name: {
    min: 2,
    max: 50,
    minMessage: 'Name must be at least 2 characters long',
    maxMessage: 'Name must be less than 50 characters',
    requiredMessage: 'Name is required'
  },
  email: {
    min: 5,
    max: 100,
    minMessage: 'Email must be at least 5 characters long',
    maxMessage: 'Email must be less than 100 characters',
    formatMessage: 'Invalid email address',
    requiredMessage: 'Email is required'
  },
  message: {
    min: 10,
    max: 1000,
    minMessage: 'Message must be at least 10 characters long',
    maxMessage: 'Message must be less than 1000 characters',
    requiredMessage: 'Message is required'
  }
};

export const contactFormSchema = z.object({
  name: z.string()
    .min(validationRules.name.min, validationRules.name.minMessage)
    .max(validationRules.name.max, validationRules.name.maxMessage),
  email: z.string()
    .email(validationRules.email.formatMessage)
    .min(validationRules.email.min, validationRules.email.minMessage)
    .max(validationRules.email.max, validationRules.email.maxMessage),
  message: z.string()
    .min(validationRules.message.min, validationRules.message.minMessage)
    .max(validationRules.message.max, validationRules.message.maxMessage)
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export default contactFormSchema;