export const areDiscountsValid = (discounts: {
  supplier: string[];
  transaction: string[];
}): boolean => {
  const isSupplierValid = discounts.supplier.every(
    (str) => /^(?:\d+|\d+%?)?$/.test(str), // Allows an empty string
  );
  const isTransactionValid = discounts.transaction.every(
    (str) => /^(?:\d+|\d+%?)?$/.test(str), // Allows an empty string
  );

  return isSupplierValid && isTransactionValid;
};

export const calculateDiscount = (
  discountStr: string,
  total: number,
): number => {
  if (discountStr.trim() === "") return 0;
  if (discountStr.includes("%")) {
    const percentage = parseFloat(discountStr.replace("%", ""));
    return (percentage / 100) * total;
  }
  return parseFloat(discountStr);
};

export const calculateTotalWithDiscounts = (
  discountArray: string[],
  initialTotal: number,
): number => {
  return discountArray.reduce(
    (subtotal, discount) => subtotal - calculateDiscount(discount, subtotal),
    initialTotal,
  );
};
