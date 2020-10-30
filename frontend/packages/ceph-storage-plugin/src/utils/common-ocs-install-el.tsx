import * as React from 'react';
import * as cx from 'classnames';
import {
  Alert,
  AlertVariant,
  AlertActionLink,
  WizardContextConsumer,
} from '@patternfly/react-core';
import { storageClassTooltip, CreateStepsSC } from '../constants/ocs-install';
import { Link } from 'react-router-dom';
import { TechPreviewBadge } from '@console/shared';
import '../components/ocs-install/ocs-install.scss';

export type Validation = {
  title: React.ReactNode;
  text: string;
  variant?: keyof typeof AlertVariant;
  link?: string;
  linkText?: string;
  actionLinkText?: string;
  actionLinkStep?: string;
};

enum ValidationType {
  'MINIMAL' = 'MINIMAL',
  'INTERNALSTORAGECLASS' = 'INTERNALSTORAGECLASS',
  'BAREMETALSTORAGECLASS' = 'BAREMETALSTORAGECLASS',
  'ALLREQUIREDFIELDS' = 'ALLREQUIREDFIELDS',
  'MINIMUMNODES' = 'MINIMUMNODES',
}

export const VALIDATIONS: { [key in ValidationType]: Validation } = {
  [ValidationType.MINIMAL]: {
    variant: AlertVariant.warning,
    title: (
      <div className="ceph-minimal-deployment-alert__header">
        A minimal cluster deployment will be performed.
        <TechPreviewBadge />
      </div>
    ),
    text:
      'The selected nodes do not match the OCS storage cluster requirement of an aggregated 30 CPUs and 72 GiB of RAM. If the selection cannot be modified, a minimal cluster will be deployed.',
    actionLinkStep: CreateStepsSC.STORAGEANDNODES,
    actionLinkText: 'Back to nodes selection',
  },
  [ValidationType.INTERNALSTORAGECLASS]: {
    variant: AlertVariant.danger,
    title: 'Select a storage class to continue',
    text: `This is a required field. ${storageClassTooltip}`,
    link: '/k8s/cluster/storageclasses/~new/form',
    linkText: 'Create new storage class',
  },
  [ValidationType.BAREMETALSTORAGECLASS]: {
    variant: AlertVariant.danger,
    title: 'Select a storage class to continue',
    text: `This is a required field. ${storageClassTooltip}`,
  },
  [ValidationType.ALLREQUIREDFIELDS]: {
    variant: AlertVariant.danger,
    title: 'All required fields are not set',
    text:
      'In order to create the storage cluster, you must set the storage class, select at least 3 nodes (preferably in 3 different zones) and meet the minimum or recommended requirement',
  },
  [ValidationType.MINIMUMNODES]: {
    variant: AlertVariant.danger,
    title: 'Minimum Node Requirement',
    text:
      'The OCS Storage cluster require a minimum of 3 nodes for the initial deployment. Please choose a different storage class or go to create a new volume set that matches the minimum node requirement.',
    actionLinkText: 'Create new volume set instance',
    actionLinkStep: CreateStepsSC.DISCOVER,
  },
};

export const ActionValidationMessage: React.FC<ValidationMessageProps> = ({
  validation,
  className,
}) => (
  <WizardContextConsumer>
    {({ goToStepById }) => {
      const {
        variant = AlertVariant.info,
        title,
        text,
        actionLinkText,
        actionLinkStep,
      } = validation;
      return (
        <Alert
          className={cx('co-alert', className)}
          variant={variant}
          title={title}
          isInline
          actionLinks={
            <AlertActionLink onClick={() => goToStepById(actionLinkStep)}>
              {actionLinkText}
            </AlertActionLink>
          }
        >
          <p>{text}</p>
        </Alert>
      );
    }}
  </WizardContextConsumer>
);

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ className, validation }) => {
  const { variant = AlertVariant.info, title, text, link, linkText } = validation;
  return (
    <Alert className={cx('co-alert', className)} variant={variant} title={title} isInline>
      <p>{text}</p>
      {link && linkText && <Link to={link}>{linkText}</Link>}
    </Alert>
  );
};

type ValidationMessageProps = {
  className?: string;
  validation: Validation;
};

export const OCSAlert = () => (
  <Alert
    className="co-alert"
    variant="info"
    title="A bucket will be created to provide the OCS Service."
    isInline
  />
);
