import mysql from "mysql2/promise";
import dotenv from "dotenv";
import yahooFinance from "yahoo-finance2";
import dateFns from "date-fns";

dotenv.config();

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

const { format } = dateFns;

async function create({ singleStoreConnection, symbol, date, close_price }) {
  try {
    const formattedDate = format(new Date(date), "yyyy-MM-dd");

    const [results] = await singleStoreConnection.execute(
      "INSERT INTO stock_data (symbol, date, close_price) VALUES (?, ?, ?)",
      [symbol, formattedDate, close_price]
    );

    return results.insertId;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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

// main is run at the end
async function main() {
  let singleStoreConnection;
  try {
    singleStoreConnection = await mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });

    console.log("You have successfully connected to SingleStore.");

    const stockData = await getStockPricesLastMonth("AAPL");

    for (let i = 0; i < stockData.length; i++) {
      const { date, close } = stockData[i];
      await create({
        singleStoreConnection,
        symbol: "AAPL",
        date,
        close_price: close,
      });
    }

    console.log("Data has been added to SingleStore.");
  } catch (error) {
    console.error(error);
  } finally {
    singleStoreConnection.end();
  }
}

main();
