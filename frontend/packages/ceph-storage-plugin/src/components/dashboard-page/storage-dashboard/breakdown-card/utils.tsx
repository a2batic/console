import * as _ from 'lodash';
import { Humanize, humanizeBinaryBytesWithoutB } from '@console/internal/components/utils';
import { PrometheusResponse, DataPoint } from '@console/internal/components/graphs';

export const getStackChartStats: GetStackStats = (response, metric, humanize) => {
  const results = _.get(response, 'data.result', []);
  return results.map((r) => {
    const y = parseFloat(_.get(r, 'value[1]'));
    const name = _.get(r, ['metric', metric], '');
    return {
      // INFO: x value needs to be same for single bar stack chart
      x: '',
      y,
      label: `${name} ${humanize(y).string}`,
    };
  });
};

type GetStackStats = (
  response: PrometheusResponse,
  metric: string,
  humanize: Humanize,
) => DataPoint[];

export const getCapacityValue = (cephUsed: any, cephTotal: any, formatValue: Humanize) => {
  const totalFormatted = cephTotal || 0;
  const usedFormatted = cephUsed || 0;
  const available = formatValue(totalFormatted - usedFormatted || 0);
  return available;
};
