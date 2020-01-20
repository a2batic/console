import * as _ from 'lodash';
import * as models from './models';

import {
  AdditionalPage,
  ClusterServiceVersionAction,
  DashboardsCard,
  DashboardsOverviewHealthPrometheusSubsystem,
  DashboardsOverviewUtilizationItem,
  DashboardsTab,
  KebabActions,
  ModelDefinition,
  ModelFeatureFlag,
  Plugin,
  RoutePage,
} from '@console/plugin-sdk';
import {
  CAPACITY_USAGE_QUERIES,
  STORAGE_HEALTH_QUERIES,
  StorageDashboardQuery,
} from './constants/queries';

import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager/src/models';
import { GridPosition } from '@console/shared/src/components/dashboard/DashboardGrid';
import { OverviewQuery } from '@console/internal/components/dashboard/dashboards-page/cluster-dashboard/queries';
import { PersistentVolumeClaimModel } from '@console/internal/models';
import { getCephHealthState } from './components/dashboard-page/storage-dashboard/status-card/utils';
import { getKebabActionsForKind } from './utils/kebab-actions';
import { referenceForModel } from '@console/internal/module/k8s';

type ConsumedExtensions =
  | ModelFeatureFlag
  | ModelDefinition
  | DashboardsTab
  | DashboardsCard
  | DashboardsOverviewHealthPrometheusSubsystem
  | DashboardsOverviewUtilizationItem
  | RoutePage
  | AdditionalPage
  | ClusterServiceVersionAction
  | KebabActions;

const CEPH_FLAG = 'CEPH';
const apiObjectRef = referenceForModel(models.OCSServiceModel);

const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: _.values(models),
    },
  },
  {
    type: 'FeatureFlag/Model',
    properties: {
      model: models.OCSServiceModel,
      flag: CEPH_FLAG,
    },
  },
  {
    type: 'Page/AdditionalPage',
    properties: {
      href: 'volumesnapshots',
      model: PersistentVolumeClaimModel,
      name: 'Volume Snapshots',
      loader: () =>
        import('./components/volume-snapshot/volume-snapshot').then((m) => m.VolumeSnapshotPage),
    },
  },
  {
    type: 'Dashboards/Tab',
    properties: {
      id: 'persistent-storage',
      title: 'Persistent Storage',
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${ClusterServiceVersionModel.plural}/:appName/${apiObjectRef}/~new`,
      loader: () =>
        import('./components/ocs-install/install-page' /* webpackChunkName: "install-page" */).then(
          (m) => m.default,
        ),
      required: CEPH_FLAG,
    },
  },
  // Ceph Storage Dashboard Left cards
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.LEFT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/details-card' /* webpackChunkName: "ceph-storage-details-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.LEFT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/inventory-card' /* webpackChunkName: "ceph-storage-inventory-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  // Ceph Storage Dashboard Main Cards
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.MAIN,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/status-card/status-card' /* webpackChunkName: "ceph-storage-status-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.MAIN,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/capacity-breakdown/capacity-breakdown-card' /* webpackChunkName: "ceph-storage-usage-breakdown-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.MAIN,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/utilization-card/utilization-card' /* webpackChunkName: "ceph-storage-utilization-card" */
        ).then((m) => m.default),
      required: CEPH_FLAG,
    },
  },
  // Ceph Storage Dashboard Right Cards
  {
    type: 'Dashboards/Card',
    properties: {
      tab: 'persistent-storage',
      position: GridPosition.RIGHT,
      loader: () =>
        import(
          './components/dashboard-page/storage-dashboard/activity-card/activity-card' /* webpackChunkName: "ceph-storage-activity-card" */
        ).then((m) => m.ActivityCard),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Overview/Health/Prometheus',
    properties: {
      title: 'Storage',
      queries: [STORAGE_HEALTH_QUERIES[StorageDashboardQuery.CEPH_STATUS_QUERY]],
      healthHandler: getCephHealthState,
      required: CEPH_FLAG,
    },
  },
  {
    type: 'Dashboards/Overview/Utilization/Item',
    properties: {
      id: OverviewQuery.STORAGE_UTILIZATION,
      query: CAPACITY_USAGE_QUERIES[StorageDashboardQuery.CEPH_CAPACITY_USED],
      totalQuery: CAPACITY_USAGE_QUERIES[StorageDashboardQuery.CEPH_CAPACITY_TOTAL],
      required: CEPH_FLAG,
    },
  },
  {
    type: 'ClusterServiceVersion/Action',
    properties: {
      kind: 'StorageCluster',
      label: 'Add Capacity',
      apiGroup: models.OCSServiceModel.apiGroup,
      callback: (kind, ocsConfig) => () => {
        const clusterObject = { ocsConfig };
        import(
          './components/modals/add-capacity-modal/add-capacity-modal' /* webpackChunkName: "ceph-storage-add-capacity-modal" */
        )
          .then((m) => m.addCapacityModal(clusterObject))
          .catch((e) => {
            throw e;
          });
      },
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/persistentvolumeclaims/:appName/volumesnapshots/:name`,
      loader: () =>
        import(
          './components/volume-snapshot/volume-snapshot' /* webpackChunkName: "metal3-baremetalhost" */
        ).then((m) => m.VolumeSnapshotDetails),
      required: CEPH_FLAG,
    },
  },
  {
    type: 'KebabActions',
    properties: {
      getKebabActionsForKind,
    },
  },
];

export default plugin;
