import { useEffect, useState } from "react";
import { getAccount, sendFunds, fetchPayments } from "../utils/stellar";

const Account = ({ wallet }) => {
  const [loading, setLoading] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [destination, setDestination] = useState({
    publicKey: "",
    amount: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getAccount(wallet?.publicKey);
      if (data?.balances) {
        setWalletDetails(data);
      }
      setLoading(false);
    };

    fetchDetails();
  }, [wallet]);

  useEffect(() => {
    if (wallet?.publicKey) {
      fetchPayments(wallet.publicKey).then(
        ({ sentPayments, receivedPayments }) => {
          const allTransactions = [
            ...sentPayments.map((payment) => ({
              ...payment,
              type: "Sent",
            })),
            ...receivedPayments.map((payment) => ({
              ...payment,
              type: "Received",
            })),
          ];

          allTransactions.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );

          setTransactions(allTransactions);
        }
      );
    }
  }, [wallet]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      {loading ? (
        <p className="text-center text-gray-700">Please Wait...</p>
      ) : (
        <div>
          {/* Display wallet balances */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Wallet Details
            </h3>
            <p className="text-gray-600">
              <strong>Balance:</strong> {walletDetails?.balances[0]?.balance}{" "}
              XLM
            </p>
            <p className="text-gray-600 truncate">
              <strong>Wallet Address:</strong> {wallet?.publicKey}
            </p>
          </div>

          {/* Send Funds Section */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Send Donations
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                const sent = await sendFunds(
                  destination?.publicKey,
                  wallet?.secretKey,
                  destination?.amount
                );
                setTransactions((prevTransactions) => [
                  {
                    amount: destination.amount,
                    asset: "lumens",
                    to: destination.publicKey,
                    timestamp: new Date().toISOString(),
                    type: "Sent",
                  },
                  ...prevTransactions,
                ]);
                setLoading(false);
                console.log(sent);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="publicKey"
                placeholder="Recipient Public Key"
                onChange={(e) =>
                  setDestination({
                    ...destination,
                    publicKey: e.target.value,
                  })
                }
                className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                onChange={(e) =>
                  setDestination({
                    ...destination,
                    amount: e.target.value,
                  })
                }
                className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Payments"}
              </button>
            </form>
          </div>

          {/* Transaction History Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Transaction History
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {transactions.map((transaction, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow">
                  <p>
                    <strong>Type:</strong> {transaction.type}
                  </p>
                  <p>
                    <strong>Amount:</strong> {transaction.amount}{" "}
                    {transaction.asset}
                  </p>
                  <p className="truncate">
                    <strong>
                      {transaction.type === "Sent" ? "To" : "From"}:
                    </strong>{" "}
                    {transaction.type === "Sent"
                      ? transaction.to
                      : transaction.from}
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
