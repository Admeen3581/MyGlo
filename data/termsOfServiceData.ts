import { PolicyData } from '@/types/policy';

export const termsOfServiceData: PolicyData = {
  title: 'Terms of Service',
  subtitle: 'Please review our terms of service below.',
  lastUpdated: 'Updated September 10, 2026',
  sections: [
    {
      heading: '1. Introduction',
      paragraphs: [
        'Welcome to our application. By accessing or using our services, you agree to be bound by these terms. Please read them carefully.',
        [
          { text: 'If you have any questions about these terms, please contact our support team at ' },
          { text: 'support@example.com', link: 'mailto:support@example.com', bold: true },
          { text: ' or visit our ' },
          { text: 'Help Center', link: 'https://example.com/help' },
          { text: '.' },
        ],
      ],
    },
    {
      heading: '2. User Accounts & Responsibilities',
      paragraphs: [
        'Placeholder text describing account creation, user responsibilities, and security guidelines.',
      ],
      bulletPoints: [
        'You must maintain the confidentiality of your account credentials.',
        'You are responsible for all activities that occur under your account.',
        [
          { text: 'For details on how we protect your personal data, see our ' },
          { text: 'Privacy Policy', link: 'https://example.com/privacy', bold: true },
          { text: '.' },
        ],
      ],
    },
    {
      heading: '3. Acceptable Use',
      paragraphs: [
        'Placeholder text explaining rules for using the platform and prohibited conduct.',
      ],
    },
    {
      heading: '4. Termination',
      paragraphs: [
        'Placeholder text outlining conditions under which access or accounts may be suspended or terminated.',
      ],
    },
    {
      heading: '5. Changes to Terms',
      paragraphs: [
        'We reserve the right to update these terms at any time. Continued use of the service constitutes acceptance of modified terms.',
      ],
    },
  ],
};
