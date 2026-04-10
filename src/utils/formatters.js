export const formatPrice = (price) => {
  if (price == null) return "가격 정보 없음";
  return `₩${Number(price).toLocaleString("ko-KR")}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
};

export const calcDiscount = (current, lowest) => {
  if (!current || !lowest || lowest === 0) return null;
  const rate = Math.round(((lowest - current) / lowest) * 100);
  return rate > 0 ? null : Math.abs(Math.round(((current - lowest) / lowest) * 100));
};

export const calcDiscountFromCurrent = (current, lowest) => {
  if (!current || !lowest || current === lowest) return 0;
  return Math.round(((current - lowest) / current) * 100);
};
