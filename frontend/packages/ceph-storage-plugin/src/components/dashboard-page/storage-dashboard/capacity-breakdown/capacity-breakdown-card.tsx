import * as React from 'react';
import * as _ from 'lodash';
import { Dropdown, humanizeBinaryBytes, humanizeBinaryBytesWithoutB } from '@console/internal/components/utils';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import { breakdownQueryMap } from '../../../../constants/queries';
import { PROJECTS } from '../../../../constants/index';
import { BreakdownCardBody } from '../breakdown-card/breakdown-body';
import { HeaderPrometheusLink } from '../breakdown-card/breakdown-header';
import { getStackChartStats } from '../breakdown-card/utils';
import './capacity-breakdown-card.scss';

const keys = Object.keys(breakdownQueryMap);
const dropdownOptions = _.zipObject(keys, keys);

const BreakdownCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const [metricType, setMetricType] = React.useState(PROJECTS);
  const { queries, model, metric } = breakdownQueryMap[metricType];
  const queryKeys = Object.keys(queries);

  React.useEffect(() => {
    queryKeys.forEach((q) => watchPrometheus(queries[q]));
    return () => queryKeys.forEach((key) => stopWatchPrometheusQuery(queries[key]));
  }, [watchPrometheus, stopWatchPrometheusQuery, metricType, queryKeys, queries]);

  const results = queryKeys.map((key) => prometheusResults.getIn([queries[key], 'data']));
  const queriesLoadError = queryKeys.some((q) =>
    prometheusResults.getIn([queries[q], 'loadError']),
  );
  const queriesDataLoaded = results.some((q) => q);
  const queriesLoaded = queriesDataLoaded || queriesLoadError;

  const totalUsed = _.get(results[0], 'data.result[0].value[1]');
  const cephTotal = _.get(results[2], 'data.result[0].value[1]');
  const cephUsed = _.get(results[3], 'data.result[0].value[1]');
  const link = [`topk(20, ${queries[queryKeys[0]]} by (${metric}))`];
  const top5UsedStats = getStackChartStats(results[1], metric, humanizeBinaryBytesWithoutB);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Capacity breakdown</DashboardCardTitle>
        <div className="ceph-capacity-breakdown-card__header">
          <HeaderPrometheusLink link={link} />
          <Dropdown
            items={dropdownOptions}
            onChange={setMetricType}
            selectedKey={metricType}
            title={metricType}
          />
        </div>
      </DashboardCardHeader>
      <DashboardCardBody>
        <BreakdownCardBody
          isLoading={!queriesLoaded}
          totalUsed={totalUsed}
          top5UsedStats={top5UsedStats}
          cephTotal={cephTotal}
          cephUsed={cephUsed}
          model={model}
          formatValue={humanizeBinaryBytesWithoutB}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(BreakdownCard);
