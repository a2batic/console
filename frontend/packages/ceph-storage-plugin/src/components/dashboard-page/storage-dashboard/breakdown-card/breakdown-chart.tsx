import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Chart,
  ChartAxis,
  ChartStack,
  ChartThemeColor,
  ChartLegend,
  ChartBar,
  ChartLabel,
  ChartTooltip,
} from '@patternfly/react-charts';
import { DataPoint } from '@console/internal/components/graphs';
import { K8sKind } from '@console/internal/module/k8s';
import { resourcePathFromModel } from '@console/internal/components/utils';

const getBarRadius = (index: number, length: number) => {
  if (index === 0) {
    return { bottom: 3 };
  }
  if (index === length - 1) {
    return { top: 3 };
  }
  return {};
};

const LinkableLegend = (props) => {
  const { model, datum } = props;

  console.log('PROPS', props);

  return (
    <>
      <Link to={resourcePathFromModel(model, datum.name)} target="_blank">
        <ChartLabel {...props} />
      </Link>
      <ChartLabel />
    </>
  );
};

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ data, legends, model }) => {
  const chartData = data.map((d: DataPoint, index) => (
    <ChartBar
      cornerRadius={getBarRadius(index, data.length)}
      barWidth={20}
      padding={10}
      data={[d]}
      labelComponent={<ChartTooltip constrainToVisibleArea />}
    />
  ));
  return (
    <Chart
      legendPosition="bottom-left"
      legendComponent={
        <ChartLegend
          itemsPerRow={2}
          themeColor={ChartThemeColor.purple}
          data={legends}
          labelComponent={<LinkableLegend model={model} />}
          orientation="horizontal"
          symbolSpacer={7}
          height={30}
          gutter={10}
          padding={{ top: 0, bottom: 0 }}
          style={{ labels: { fontSize: 8, color: 'blue' } }}
        />
      }
      height={100}
      padding={{
        bottom: 75,
        left: 30,
        right: 30,
        top: 30,
      }}
      themeColor={ChartThemeColor.multiOrdered}
    >
      <ChartAxis
        style={{ axis: { stroke: 'none' }, ticks: { stroke: 'none' } }}
        tickFormat={() => ''}
      />
      <ChartStack horizontal>{chartData}</ChartStack>
    </Chart>
  );
};

type BreakdownChartProps = {
  data: DataPoint[];
  legends: { name: string }[];
  model: K8sKind;
};
