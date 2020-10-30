import { defaultRequestSize, ClusterMode } from '../../../constants';
import { StorageClassResourceKind, NodeKind } from '@console/internal/module/k8s';

export type InternalClusterState = {
  storageClass: StorageClassResourceKind;
  capacity: string;
  nodes: NodeKind[];
  enableMinimal: boolean;

  // Encryption state declare
  enableClusterWideEncryption: boolean;
  enablePvEncryption: boolean;
  hasEncryptionHandled: boolean;
  kmsServiceName: string;

  modeType: string;
};

export enum ActionType {
  SET_STORAGE_CLASS = 'SET_STORAGE_CLASS',
  SET_CAPACITY = 'SET_CAPACITY',
  SET_NODES = 'SET_NODES',
  SET_ENABLE_MINIMAL = 'SET_ENABLE_MINIMAL',

  // Encryption state actions
  SET_CLUSTER_WIDE_ENABLE_ENCRYPTION = 'SET_CLUSTER_WIDE_ENABLE_ENCRYPTION',
  SET_PV_ENABLE_ENCRYPTION = 'SET_PV_ENABLE_ENCRYPTION',
  SET_ENCRYPTION_VALID = 'SET_ENCRYPTION_VALID',
  SET_KMS_ENCRYPTION = 'SET_KMS_ENCRYPTION',
}

export type InternalClusterAction =
  | { type: ActionType.SET_STORAGE_CLASS; payload: StorageClassResourceKind }
  | { type: ActionType.SET_CAPACITY; payload: string }
  | { type: ActionType.SET_NODES; payload: NodeKind[] }

  // Encryption actions
  | { type: ActionType.SET_CLUSTER_WIDE_ENABLE_ENCRYPTION; payload: boolean }
  | { type: ActionType.SET_PV_ENABLE_ENCRYPTION; payload: boolean }
  | { type: ActionType.SET_ENABLE_MINIMAL; payload: boolean }
  | { type: ActionType.SET_ENCRYPTION_VALID; payload: boolean }
  | { type: ActionType.SET_KMS_ENCRYPTION; payload: string };

export const initialState: InternalClusterState = {
  storageClass: { provisioner: '', reclaimPolicy: '' },
  capacity: defaultRequestSize.NON_BAREMETAL,
  nodes: [],
  enableMinimal: false,

  // Encryption state initialization
  enableClusterWideEncryption: false,
  enablePvEncryption: false,
  kmsServiceName: '',
  hasEncryptionHandled: true,

  modeType: ClusterMode.INTERNAL,
};

export const reducer = (state: InternalClusterState, action: InternalClusterAction) => {
  switch (action.type) {
    case ActionType.SET_STORAGE_CLASS: {
      return {
        ...state,
        storageClass: action.payload,
      };
    }
    case ActionType.SET_CAPACITY: {
      return {
        ...state,
        capacity: action.payload,
      };
    }
    case ActionType.SET_NODES: {
      return {
        ...state,
        nodes: action.payload,
      };
    }
    case ActionType.SET_ENABLE_MINIMAL: {
      return {
        ...state,
        enableMinimal: action.payload,
      };
    }

    // Encryption state reducer
    case ActionType.SET_CLUSTER_WIDE_ENABLE_ENCRYPTION: {
      return {
        ...state,
        enableClusterWideEncryption: action.payload,
      };
    }
    case ActionType.SET_PV_ENABLE_ENCRYPTION: {
      return {
        ...state,
        enablePvEncryption: action.payload,
      };
    }
    case ActionType.SET_ENCRYPTION_VALID: {
      return {
        ...state,
        hasEncryptionHandled: action.payload,
      };
    }
    case ActionType.SET_KMS_ENCRYPTION: {
      return {
        ...state,
        kmsServiceName: action.payload,
      };
    }

    default:
      return state;
  }
};
