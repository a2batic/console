import * as React from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { State, Action } from '../ocs-install/attached-devices/create-sc/state';
import {
  InternalClusterState,
  InternalClusterAction,
  ActionType,
} from '../ocs-install/internal-mode/reducer';
import { ClusterMode } from '../../constants/ocs-install';
import * as _ from 'lodash';

/* @TODO - complete KMS View in follow up PR */
export const KMSConfigure: React.FC<KMSConfigureProps> = ({ state, dispatch }) => {
  const { modeType, kmsServiceName } = state;
  const [serviceName, setServiceName] = React.useState<string>(kmsServiceName);

  const setDispatch = (keyType: any, valueType: any) => {
    const stateType = modeType === ClusterMode.ATTACHED ? _.camelCase(keyType) : keyType;
    const stateValue =
      modeType === ClusterMode.ATTACHED ? { value: valueType } : { payload: valueType };
    dispatch({ type: stateType, ...stateValue });
  };

  React.useEffect(() => {
    if (!_.isEmpty(serviceName)) {
      setDispatch(ActionType.SET_ENCRYPTION_VALID, true);
    } else {
      setDispatch(ActionType.SET_ENCRYPTION_VALID, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceName]);

  const getServiceName = (name: string) => {
    setDispatch(ActionType.SET_KMS_ENCRYPTION, name);
    setServiceName(name);
  };

  return (
    <>
      <FormGroup
        fieldId="kms-service-name"
        label="Service Name"
        className="co-m-pane__form ocs-install-encryption__form-body"
        isRequired
      >
        <TextInput
          value={serviceName}
          onChange={getServiceName}
          isRequired
          type="text"
          id="kms-service-name"
          name="kms-service-name"
        />
      </FormGroup>
    </>
  );
};

type KMSConfigureProps = {
  state: State | InternalClusterState;
  dispatch: React.Dispatch<Action | InternalClusterAction>;
};
