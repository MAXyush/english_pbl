import { ReactNode } from 'react';

interface BarChartProps {
  children: ReactNode;
  data: any[];
}

interface BarProps {
  dataKey: string;
  fill?: string;
}

interface XAxisProps {
  dataKey: string;
}

interface CartesianGridProps {
  strokeDasharray?: string;
}

interface ResponsiveContainerProps {
  children: ReactNode;
  width?: string | number;
  height?: string | number;
}

export const BarChart = ({ children, data }: BarChartProps) => {
  return <div>{children}</div>;
};

export const Bar = ({ dataKey, fill }: BarProps) => {
  return null;
};

export const XAxis = ({ dataKey }: XAxisProps) => {
  return null;
};

export const YAxis = () => {
  return null;
};

export const CartesianGrid = ({ strokeDasharray }: CartesianGridProps) => {
  return null;
};

export const Tooltip = () => {
  return null;
};

export const ResponsiveContainer = ({ children, width = "100%", height = 400 }: ResponsiveContainerProps) => {
  return <div style={{ width, height }}>{children}</div>;
};
