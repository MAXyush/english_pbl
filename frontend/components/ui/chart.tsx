export const BarChart = ({ children, data }) => {
  return <div>{children}</div>;
};

export const Bar = ({ dataKey, fill }) => {
  return null;
};

export const XAxis = ({ dataKey }) => {
  return null;
};

export const YAxis = () => {
  return null;
};

export const CartesianGrid = ({ strokeDasharray }) => {
  return null;
};

export const Tooltip = () => {
  return null;
};

export const ResponsiveContainer = ({ children, width, height }) => {
  return <div style={{ width: width, height: height }}>{children}</div>;
};
