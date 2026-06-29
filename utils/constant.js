export const calculateTotal = (currency) => {
  let total = 0;
  console.log('currency',currency)
  for (const note in currency) {
    total += Number(note) * Number(currency[note]);
  }

  return total;
};

export const mergeCurrency = (oldCurrency, newCurrency) => {
  // Parse if string
  if (typeof oldCurrency === "string") {
    oldCurrency = JSON.parse(oldCurrency);
  }

  const result = { ...oldCurrency };

  for (const note in newCurrency) {
    result[note] = (result[note] ?? 0) + newCurrency[note];
  }

  return result;
};

export const calculateRemainingCurrency = (currency, drawerCurrency) => {
  const result = { ...drawerCurrency };

  for (const note in currency) {
    if (!result[note] || result[note] < currency[note]) {
      throw new Error("Insufficient cash in drawer");
    }
    result[note] = (result[note] ?? 0) - currency[note];
  }

  return result;
};
