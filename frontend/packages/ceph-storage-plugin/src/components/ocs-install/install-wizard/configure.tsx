import * as React from 'react';
import * as _ from 'lodash';

import { FormGroup, Checkbox, Alert } from '@patternfly/react-core';
import { FieldLevelHelp } from '@console/internal/components/utils';
import { encryptionTooltip, ClusterMode } from '../../../constants/ocs-install';
import { TechPreviewBadge } from '@console/shared';
import { InternalClusterState, InternalClusterAction, ActionType } from '../internal-mode/reducer';
import { State, Action } from '../attached-devices/create-sc/state';
import { KMSConfigure } from '../../kms-config/kms-config';
import './install-wizard.scss';

const PVEncryptionLabel: React.FC = () => (
  <div className="ocs-install-encryption__pv-title">
    <span className="ocs-install-encryption__pv-title--padding">Storage class encryption</span>
    <TechPreviewBadge />
  </div>
);

export const EncryptionFormGroup: React.FC<EncryptionFormGroupProps> = ({ state, dispatch }) => {
  const { modeType, enableClusterWideEncryption, enablePvEncryption, kmsServiceName } = state;
  const [clusterWideChecked, setClusterWideChecked] = React.useState(enableClusterWideEncryption);
  const [pvChecked, setPVChecked] = React.useState(enablePvEncryption);
  const [advancedChecked, setAdvancedChecked] = React.useState(!!kmsServiceName);
  const [nextValid, setNextValid] = React.useState(true);
  const [encryptionChecked, setEncryptionChecked] = React.useState(
    enableClusterWideEncryption || enablePvEncryption,
  );

  const setDispatch = React.useCallback(
    (keyType: any, valueType: any) => {
      const stateType = modeType === ClusterMode.ATTACHED ? _.camelCase(keyType) : keyType;
      const stateValue =
        modeType === ClusterMode.ATTACHED ? { value: valueType } : { payload: valueType };
      dispatch({ type: stateType, ...stateValue });
    },
    [dispatch, modeType],
  );

  React.useEffect(() => {
    if (!clusterWideChecked && !pvChecked && encryptionChecked) {
      setNextValid(false);
      setDispatch(ActionType.SET_ENCRYPTION_VALID, false);
      setAdvancedChecked(false);
    } else if (pvChecked && _.isEmpty(kmsServiceName)) {
      setNextValid(true);
      setDispatch(ActionType.SET_ENCRYPTION_VALID, false);
    } else {
      setNextValid(true);
      setDispatch(ActionType.SET_ENCRYPTION_VALID, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterWideChecked, pvChecked, encryptionChecked]);

  const toggleEncryption = (checked: boolean) => {
    setDispatch(ActionType.SET_CLUSTER_WIDE_ENABLE_ENCRYPTION, checked);
    setEncryptionChecked(checked);
    setClusterWideChecked(checked);
    if (!checked) {
      setDispatch(ActionType.SET_PV_ENABLE_ENCRYPTION, checked);
      setDispatch(ActionType.SET_KMS_ENCRYPTION, '');
    }
  };

  const toggleClusterWideEncryption = (checked: boolean) => {
    setDispatch(ActionType.SET_CLUSTER_WIDE_ENABLE_ENCRYPTION, checked);
    setClusterWideChecked(checked);
  };

  const togglePVEncryption = (checked: boolean) => {
    setDispatch(ActionType.SET_PV_ENABLE_ENCRYPTION, checked);
    setPVChecked(checked);
  };

  const toggleAdvancedEncryption = (checked: boolean) => {
    setAdvancedChecked(checked);
    if (!checked) {
      setDispatch(ActionType.SET_KMS_ENCRYPTION, '');
    }
  };

  return (
    <FormGroup fieldId="configure-encryption" label="Encryption">
      <Checkbox
        id="configure-encryption"
        isChecked={encryptionChecked}
        label="Enable Encryption"
        aria-label="Checkbox with description example"
        description="Data encryption for block and file storage. Object storage is always encrypted."
        onChange={toggleEncryption}
      />
      {encryptionChecked && (
        <div className="ocs-install-encryption">
          <FormGroup
            fieldId="encryption-options"
            label="Encryption level"
            labelIcon={<FieldLevelHelp>{encryptionTooltip}</FieldLevelHelp>}
            className="ocs-install-encryption__form-body"
          >
            <Checkbox
              id="cluster-wide-encryption"
              isChecked={clusterWideChecked}
              label={
                <span className="ocs-install-encryption__pv-title--padding">
                  Cluster-wide encryption
                </span>
              }
              aria-label="Checkbox with Cluster-wide encryption"
              description="Encryption for the entire cluster (block and file)"
              onChange={toggleClusterWideEncryption}
              className="ocs-install-encryption__form-checkbox"
            />
            <Checkbox
              id="pv-encryption"
              isChecked={pvChecked}
              label={<PVEncryptionLabel />}
              aria-label="Checkbox with Cluster-wide encryption"
              description="A new storage class will be created with encryption enabled. Encryption key for each Persistent volume (block only) will be generated."
              onChange={togglePVEncryption}
              className="ocs-install-encryption__form-checkbox"
            />
          </FormGroup>
          {!nextValid && (
            <Alert
              variant="danger"
              className="co-alert ocs-install-encryption__form-alert"
              title="Select at least 1 encryption level or disable encryption"
              isInline
            />
          )}
          <FormGroup
            fieldId="advanced-encryption-options"
            label="Connection settings"
            className="ocs-install-encryption__form-body"
          >
            <Checkbox
              id="advanced-encryption"
              isChecked={advancedChecked || pvChecked}
              label="Connect to an external key management service"
              aria-label="Checkbox with advanced encryption"
              onChange={toggleAdvancedEncryption}
              isDisabled={pvChecked || !nextValid}
            />
          </FormGroup>
          {(advancedChecked || pvChecked) && <KMSConfigure state={state} dispatch={dispatch} />}
        </div>
      )}
    </FormGroup>
  );
};

type EncryptionFormGroupProps = {
  state: State | InternalClusterState;
  dispatch: React.Dispatch<Action | InternalClusterAction>;
};
