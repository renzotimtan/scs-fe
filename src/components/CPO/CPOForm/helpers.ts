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

export const areCustomerDiscountsValid = (discounts: {
  customer: string[];
  transaction: string[];
}): boolean => {
  const isCustomerValid = discounts.customer.every(
    (str) => /^(?:\d+|\d+%?)?$/.test(str), // Allows an empty string
  );
  const isTransactionValid = discounts.transaction.every(
    (str) => /^(?:\d+|\d+%?)?$/.test(str), // Allows an empty string
  );

  return isCustomerValid && isTransactionValid;
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
  discounts: { customer: string[]; transaction: string[] },
  initialTotal: number,
): number => {
  // Combine all discounts into a single array
  const allDiscounts = [...discounts.customer, ...discounts.transaction];

  // Separate percentage and fixed amount discounts
  const percentageDiscounts = allDiscounts.filter((d) => d.includes("%"));
  const fixedDiscounts = allDiscounts.filter(
    (d) => !d.includes("%") && d.trim() !== "",
  );

  // Apply percentage discounts first
  let subtotal = percentageDiscounts.reduce(
    (currentTotal, discount) =>
      currentTotal - calculateDiscount(discount, currentTotal),
    initialTotal,
  );

  // Apply fixed amount discounts next
  subtotal = fixedDiscounts.reduce(
    (currentTotal, discount) =>
      currentTotal - calculateDiscount(discount, initialTotal), // Fixed discounts use initial total
    subtotal,
  );

  return subtotal;
};
