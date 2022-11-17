import axios from "axios";
import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import "./App.css";

function App() {
  const [data, setData] = useState({});
  const [completeData, setcompleteData] = useState({});
  const [months, setMonths] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  const [products, setproducts] = useState([]);
  const [revenueTypes, setRevenueTypes] = useState([]);
  const [selectedRevenueTypes, setSelectedRevenueTypes] = useState([]);
  const [selected, setSelected] = useState([]);
  const monthRevenue = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get("http://fetest.pangeatech.net/data");
      const temp = {};
      res.data.map((item) => {
        if (!(item.product in temp)) {
          temp[item.product] = {
            business_line: item.line_of_business,
          };
        }
        if (!(item.line_of_business in temp[item.product])) {
          temp[item.product][item.line_of_business] = {};
        }
        if (!(item.revenue_type in temp[item.product][item.line_of_business])) {
          temp[item.product][item.line_of_business][item.revenue_type] = {};
        }

        temp[item.product][item.line_of_business][item.revenue_type][
          item.month
        ] = item;
      });

      const chart = {};
      const tempProducts = [];
      const tempRevenueTypes = [];
      const tempRevenueTypes1 = [];

      Object.keys(temp).forEach((product) => {
        chart[product] = { ...monthRevenue };
        tempProducts.push(product);
        Object.keys(temp[product][temp[product].business_line]).forEach(
          (rType) => {
            if (!tempRevenueTypes.includes(rType)) {
              tempRevenueTypes.push(rType);
              tempRevenueTypes1.push({ label: rType, value: rType });
            }
            Object.keys(monthRevenue).forEach((month) => {
              chart[product][month] +=
                temp[product][temp[product].business_line][rType][month]
                  ?.revenue || 0;
            });
          }
        );
      });
      setproducts(tempProducts);
      setRevenueTypes(tempRevenueTypes1);
      setData(chart);
      setcompleteData(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const filter = (list) => {
    let temp = [];
    if (list.length > 0) {
      list.map((item) => {
        if (!(item.value in temp)) {
          temp.push(item.value);
        }
      });
      const chart = {};
      Object.keys(completeData).forEach((product) => {
        chart[product] = { ...monthRevenue };
        Object.keys(
          completeData[product][completeData[product].business_line]
        ).forEach((rType) => {
          if (temp.includes(rType)) {
            Object.keys(monthRevenue).forEach((month) => {
              chart[product][month] +=
                completeData[product][completeData[product].business_line][
                  rType
                ][month]?.revenue || 0;
            });
          }
        });
      });
      setData({ ...chart });
    }
  };
  //console.log(data);
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: "300px" }}>
          <MultiSelect
            options={revenueTypes || []}
            value={selected}
            onChange={(e) => {
              setSelected(e);
              filter(e);
            }}
            labelledBy="Select"
          />
        </div>
        <div>
          <h3>Hey john</h3>
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <table style={{ border: "solid 1px grey" }}>
          {data ? (
            <tr>
              <th>Product</th>
              <th>January</th>
              <th>February</th>
              <th>March</th>
              <th>April</th>
              <th>May</th>
              <th>June</th>
              <th>July</th>
              <th>August</th>
              <th>September</th>
              <th>October</th>
              <th>November</th>
              <th>December</th>
            </tr>
          ) : (
            <h1>Loading</h1>
          )}

          {data &&
            products.map((product) => {
              return (
                <tr style={{ border: "solid 0.5px grey" }}>
                  <td>{product}</td>
                  {months.map((month) => (
                    <td>{data[product][month].toFixed(2)}</td>
                  ))}
                </tr>
              );
            })}
        </table>
      </div>
    </div>
  );
}

export default App;
