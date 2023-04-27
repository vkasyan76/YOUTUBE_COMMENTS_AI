import yahooFinance from "yahoo-finance2";

// const quote = await yahooFinance.quote("AAPL");

async function getStockPricesLastMonth(symbol) {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const historicalData = await yahooFinance.historical(symbol, {
    period1: oneMonthAgo.getTime() / 1000,
    period2: today.getTime() / 1000,
    interval: "1d",
  });

  return historicalData;
}

// Example usage:
getStockPricesLastMonth("AAPL")
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
