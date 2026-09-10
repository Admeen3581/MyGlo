import React from 'react';
import { ParagraphModal, ParagraphModalProps } from '@/components/ParagraphModal';
import { termsOfServiceData } from '@/data/termsOfServiceData';
import { PolicyData } from '@/types/policy';

export interface TermsOfServiceProps extends Omit<ParagraphModalProps, 'data'> {
  data?: PolicyData;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  visible,
  onClose,
  data = termsOfServiceData,
  isDarkMode,
  actionButtonText,
  onAction,
  ...props
}) => {
  return (
    <ParagraphModal
      visible={visible}
      onClose={onClose}
      data={data}
      isDarkMode={isDarkMode}
      actionButtonText={actionButtonText}
      onAction={onAction}
      {...props}
    />
  );
};

export default TermsOfService;
