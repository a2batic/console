import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { InternalClusterAction, InternalClusterState } from '../reducer';
import { EncryptionFormGroup } from '../../install-wizard/configure';

export const Configure: React.FC<ConfigureProps> = ({ state, dispatch }) => {
  return (
    <Form>
      <EncryptionFormGroup state={state} dispatch={dispatch} />
    </Form>
  );
};

type ConfigureProps = {
  state: InternalClusterState;
  dispatch: React.Dispatch<InternalClusterAction>;
};
