import { useEffect, useState } from "react";
import Charts from "./components/Charts";
import InterestTable from "./components/InterestTable";
import QueryTable from "./components/QueryTable";
import { getInterest, getQueries } from "@/apis/apiServices";

export default function Home() {
  const [queries, setQueries] = useState([]);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    getQueries().then(setQueries);
    getInterest().then(setInterest);
  }, []);
  return (
    <div>
      <Charts queries={queries} interest={interest} />
      <QueryTable data={queries} />
      <InterestTable data={interest} />
    </div>
  );
}
