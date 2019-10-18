import * as React from 'react';

export const TotalCapacityBody: React.FC<TotalCapacityBodyProps> = ({ value }) => {
  return <p className="ceph-capacity-breakdown-card__body">{value}</p>;
};

type TotalCapacityBodyProps = {
  value: string;
};
