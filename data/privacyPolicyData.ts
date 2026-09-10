import { PolicyData } from '@/types/policy';

export const privacyPolicyData: PolicyData = {
  title: 'Privacy Policy',
  subtitle: 'How we collect, use, and protect your information.',
  lastUpdated: 'Updated September 10, 2026',
  sections: [
    {
      heading: '1. Information We Collect',
      paragraphs: [
        'Placeholder text describing the types of information collected when using our application.',
        [
          { text: 'We respect your personal privacy. If you have questions about data collection, email ' },
          { text: 'privacy@example.com', link: 'mailto:privacy@example.com', bold: true },
          { text: '.' },
        ],
      ],
      bulletPoints: [
        'Account Information: Name, email address, and profile details.',
        'Usage Data: Information about interaction with features and lists.',
      ],
    },
    {
      heading: '2. How We Use Information',
      paragraphs: [
        'Placeholder text outlining how collected data is used to provide, improve, and secure our services.',
      ],
    },
    {
      heading: '3. Data Sharing & Third Parties',
      paragraphs: [
        'Placeholder text detailing third-party service integration and data sharing policies.',
        [
          { text: 'Review our complete ' },
          { text: 'Terms of Service', link: 'https://example.com/terms' },
          { text: ' for additional information on service policies.' },
        ],
      ],
    },
    {
      heading: '4. Your Data Rights',
      paragraphs: [
        'Placeholder text describing user rights regarding accessing, updating, or deleting personal information.',
      ],
    },
  ],
};
