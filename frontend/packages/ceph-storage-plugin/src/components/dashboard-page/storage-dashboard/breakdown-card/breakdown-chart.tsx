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

const LinkableLegend: React.FC<> = (props) => {
  const legendData = props.data;

  return legendData.map(d => {
    <Link to={} ><ChartLabel datum={{name: d}}/></Link>
  });
};

export const BreakdownChart: React.FC<{}> = () => {
  return (
    <Chart
      ariaDesc="Average number of pets"
      legendPosition="bottom-left"
      legendComponent={
        <ChartLegend
          themeColor={ChartThemeColor.purple}
          data={[{ name: 'Cats' }, { name: 'Dogs' }, { name: 'Birds' }, { name: 'Mice' }]}
          labelComponent={<LinkableLegend />}
          orientation="horizontal"
          symbolSpacer={7}
          height={30}
          gutter={10}
          //   padding={{ top: 0, bottom: 0 }}
          //   style={{ labels: { fontSize: 8 } }}
        />
      }
      height={100}
      padding={{
        bottom: 30,
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
      <ChartStack horizontal>
        <ChartBar
          cornerRadius={{ bottom: 3 }} // look for it
          barWidth={20}
          padding={10}
          data={[{ name: 'Cats', x: '', y: 1, label: 'Cats: 1' }]}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
        <ChartBar
          barWidth={20}
          padding={10}
          data={[{ name: 'Dogs', x: '', y: 2, label: 'Dogs: 2' }]}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
        <ChartBar
          barWidth={20}
          padding={10}
          data={[{ name: 'Birds', x: '', y: 4, label: 'Birds: 4' }]}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
        <ChartBar
          barWidth={20}
          padding={10}
          cornerRadius={{ top: 3 }}
          data={[{ name: 'Mice', x: '', y: 3, label: 'Mice: 3' }]}
          labelComponent={<ChartTooltip constrainToVisibleArea />}
        />
      </ChartStack>
    </Chart>
  );
};
