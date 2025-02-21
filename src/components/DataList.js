import React from "react";

const DataList = ({ data }) => {
  return (
    <div>
      <h1>Data List</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.x}: {item.y}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
