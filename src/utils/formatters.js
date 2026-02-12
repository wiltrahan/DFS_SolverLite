export const formatCurrency = (n) => "$" + n.toLocaleString();

export const formatPercent = (x) => 
  (x == null || isNaN(x)) ? "0.0%" : (Number(x).toFixed(1) + "%");
