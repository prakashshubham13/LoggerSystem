import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { dummyData } from "../data/data";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalBidAmount, setTotalBidAmount] = useState(0);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const filteredData = dummyData.filter(
      (item) => new Date(item.creation_timestamp) >= sevenDaysAgo
    );

    const total = filteredData.reduce(
      (sum, item) => sum + item.submitted_amount,
      0
    );

    const groupedByDate = filteredData.reduce((acc, item) => {
      const date = item.creation_timestamp.split(" ")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item.submitted_amount;
      return acc;
    }, {});

    const sortedBreakdown = Object.entries(groupedByDate).sort(
      ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
    );

    setTotalBidAmount(total);
    setBreakdown(sortedBreakdown);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>Demo Visualizer</div>
        <div className={styles.totalBidAmount}>
          Total Bid Submitted: ${totalBidAmount.toFixed(2)} USD
          <div className={styles.breakdown}>
            {breakdown.map(([date, amount]) => (
              <div key={date}>
                {formatDate(date)} - ${amount.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.label}>
        Displaying data analytics for the past 7 days
      </div>
    </header>
  );
};

export default Header;
