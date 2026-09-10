export interface PolicyTextSegment {
  text: string;
  link?: string;
  bold?: boolean;
  italic?: boolean;
}

export type PolicyParagraph = string | PolicyTextSegment[];

export interface PolicySection {
  id?: string;
  heading?: string;
  paragraphs?: PolicyParagraph[];
  bulletPoints?: PolicyParagraph[];
}

export interface PolicyData {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  version?: string;
  sections: PolicySection[];
}
