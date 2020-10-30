import * as React from 'react';
import { Form } from '@patternfly/react-core';
import { State, Action } from '../state';
import { EncryptionFormGroup } from '../../../install-wizard/configure';

export const Configure: React.FC<ConfigureProps> = ({ state, dispatch }) => {
  return (
    <Form>
      <EncryptionFormGroup state={state} dispatch={dispatch} />
    </Form>
  );
};

type ConfigureProps = {
  state: State;
  dispatch: React.Dispatch<Action>;
};
