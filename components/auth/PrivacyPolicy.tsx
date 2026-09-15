import React from 'react';
import { ParagraphModal, ParagraphModalProps } from '@/components/core/ParagraphModal';
import { privacyPolicyData } from '@/data/privacyPolicyData';
import { PolicyData } from '@/types/policy';

export interface PrivacyPolicyProps extends Omit<ParagraphModalProps, 'data'> {
  data?: PolicyData;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  visible,
  onClose,
  data = privacyPolicyData,
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

export default PrivacyPolicy;
