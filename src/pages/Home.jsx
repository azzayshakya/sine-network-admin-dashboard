import { useEffect, useState } from "react";
import Charts from "./components/Charts";
import InterestTable from "./components/InterestTable";
import QueryTable from "./components/QueryTable";
import { getInterest, getQueries } from "@/apis/apiServices";

export default function Home() {
  const [queries, setQueries] = useState([]);
  const [interest, setInterest] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [queriesData, interestData] = await Promise.all([
          getQueries(),
          getInterest(),
        ]);

        setQueries(queriesData);
        setInterest(interestData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // if (loading) {
  //   return <div>Loading data...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div>
      <Charts queries={queries} loading={loading} interest={interest} />
      <QueryTable data={queries} loading={loading} />
      <InterestTable data={interest} loading={loading} />
    </div>
  );
}
