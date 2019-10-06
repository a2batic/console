import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { humanizeBinaryBytesWithoutB, ExternalLink } from '@console/internal/components/utils';
import { getInstantVectorStats, GetStats } from '@console/internal/components/graphs/utils';
import { getPrometheusExpressionBrowserURL } from '@console/internal/components/graphs/prometheus-graph';
import { MonitoringRoutes, connectToURLs } from '@console/internal/reducers/monitoring';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { RootState } from '@console/internal/redux';

import './capacity-breakdown-card.scss';

let capValues: any;
let topFiveCapacitySum = 0;
export const getCardUsedValue = (results: any[]) => {
  const getLastStats = (response: any, getStats: GetStats): React.ReactText => {
    const stats = getStats(response);
    return stats.length > 0 ? stats[stats.length - 1].y : null;
  };

  const statUsed: React.ReactText = getLastStats(results ? results[1] : 0, getInstantVectorStats);
  const statTotal: React.ReactText = getLastStats(results ? results[0] : 0, getInstantVectorStats);

  const totalFormatted = humanizeBinaryBytesWithoutB(statTotal || 0, 'i', 'Gi');
  const usedFormatted = humanizeBinaryBytesWithoutB(statUsed || 0, 'i', 'Gi');
  const available = humanizeBinaryBytesWithoutB(
    totalFormatted.value - usedFormatted.value || 0,
    'Gi',
    'Gi',
  );

  capValues = {
    total: totalFormatted,
    used: usedFormatted,
    available,
  };

  return capValues;
};

export const getCardAvailableValue = (results: PrometheusResponse[]) => {
  getCardUsedValue(results);
  return capValues;
};

export const getGraphVectorStats = (results: PrometheusResponse[]) => {
  const topConsumerStatsResult = _.get(results[0], 'data.result', []);
  const allConsumerResult = _.get(results[1], 'data.result', []);
  let value = {};
  const values = [];
  topConsumerStatsResult.forEach((r) => {
    const truncatedName = _.truncate(
      r.metric.namespace ? r.metric.namespace : r.metric.storageclass,
      { length: 40 },
    );
    const yValue = Number(humanizeBinaryBytesWithoutB(r.value[1], 'i', 'Gi').value);
    topFiveCapacitySum += yValue;
    value = {
      name: truncatedName,
      x: 0,
      y: yValue,
    };
    values.push([value]);
  });
  const availableCapacity = {
    name: 'Available',
    x: 0,
    y: Number(capValues ? capValues.available.value : 0),
  };

  const otherCapacity = {
    name: 'Other',
    x: 0,
    y:
      allConsumerResult && allConsumerResult[0]
        ? Number(humanizeBinaryBytesWithoutB(allConsumerResult[0].value[1], 'i', 'Gi').value) -
          topFiveCapacitySum
        : 0,
  };
  topFiveCapacitySum = 0;
  values.push([otherCapacity]);
  values.push([availableCapacity]);
  return values;
};

const legendName = (obj: any) => {
  const legendValue = `${_.truncate(obj.name ? obj.name : obj.storageclass, { length: 11 })}\n${
    obj.y
  } Gi`;
  return legendValue;
};

const legendLink = (obj: any) => {
  let link: string;
  if (obj.name) {
    link = `/k8s/cluster/projects/${obj.name}`;
  } else if (obj.storageclasses) {
    link = `/k8s/cluster/storageclasses/${obj.storageclass}`;
  }
  return link;
};

export const getGraphLegendsStats = (response: any[]) => {
  let legend;
  const legends = [];
  response.forEach((r) => {
    legend = {
      name: legendName(r[0]),
      link: legendLink(r[0]),
      value: r[0].y,
    };
    legends.push([legend]);
  });
  legends.pop(); // To remove 'Available' from labels
  return legends;
};

const headerPrometheusLinkStateToProps = ({ UI }: RootState, { urls }) => {
  const liveQueries = UI.getIn(['queryBrowser', 'queries']).filter(
    (q) => q.get('isEnabled') && q.get('query'),
  );
  const queryStrings = _.map(liveQueries.toJS(), 'query');
  return {
    url: getPrometheusExpressionBrowserURL(urls, queryStrings) || urls[MonitoringRoutes.Prometheus],
  };
};

const HeaderPrometheusViewLink = ({ url }) => (
  <div className="ceph-capacity-breakdown-card__monitoring-header-link">
    <ExternalLink href={url} text="View more" />
  </div>
);

export const HeaderPrometheusLink = connectToURLs(MonitoringRoutes.Prometheus)(
  connect(headerPrometheusLinkStateToProps)(HeaderPrometheusViewLink),
);
