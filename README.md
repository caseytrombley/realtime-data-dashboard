# ⚡ Real-Time Energy Usage Dashboard

This project is a **Vue 3 application** that displays **real-time energy usage data** using **GraphQL subscriptions**.  
It’s designed to visualize incoming energy consumption metrics as a live-updating chart, making it easy to monitor usage trends over time.

---

## 🚀 Features

- **Real-Time Updates**  
  Uses GraphQL subscriptions (`@vue/apollo-composable`) to receive new energy usage data instantly without refreshing the page.

- **Dynamic Line Chart**  
  Visualizes energy usage (`kW`) with a responsive line chart powered by [Chart.js](https://www.chartjs.org/) via [`vue-chartjs`](https://vue-chartjs.org/).

- **Automatic Sliding Window**  
  Displays the **latest 10 data points**, automatically shifting older data out of view to keep the chart concise and readable.

- **GraphQL Integration**  
  Fully integrated with a GraphQL server that publishes `energyUsageUpdated` events via a PubSub mechanism.

---

## 📊 How It Works

1. The frontend connects to a GraphQL server using a WebSocket transport (`graphql-ws`) for live updates.
2. The server publishes events whenever energy usage changes:
   ```graphql
   subscription OnEnergyUsageUpdated {
     energyUsageUpdated {
       timestamp
       value
     }
   }
   ```

3. Each incoming update contains:
    - `timestamp`: ISO string of the data point.
    - `value`: The measured energy usage (in kilowatts).

4. The client:
    - Converts the timestamp into a human-readable time.
    - Appends the new value to the chart dataset.
    - Removes older data once more than 10 points are shown.

5. The `<Line>` chart automatically re-renders with the updated data.

---

## 🛠️ Tech Stack

**Frontend**
- Vue 3 with `<script setup>`
- Apollo Client via `@vue/apollo-composable`
- GraphQL Subscriptions
- Chart.js & vue-chartjs

**Backend**
- GraphQL server with `graphql-subscriptions`
- PubSub for pushing real-time energy usage events

---


## ⚙️ Getting Started

1. **Install dependencies**
   ```bash
   npm install
    ```
   
2. **Run the development server**
   ```bash
   npm start
   ```
   
3. **Connect to a GraphQL backend**
   Ensure your GraphQL server is running with a `Subscription` for `energyUsageUpdated`.
   The Apollo client will automatically connect and start receiving live updates.

## 📈 Example Data Flow
Server publishes:

```js
pubsub.publish("ENERGY_USAGE_UPDATED", {
  energyUsageUpdated: {
    timestamp: "2025-08-05T02:25:52.616Z",
    value: 64.57,
  },
});
```

Client receives and renders chart point:

- Time: `2:25:52 AM`

- Value: `64.57 kW`


## 🌱 Future Enhancements
- Add authentication for user-specific energy dashboards.

- Implement historical data view (daily/weekly usage).

- Alert system for threshold breaches (e.g., unusually high consumption).

- Support for multiple energy sources or devices.


## 📜 License
MIT License — feel free to use and adapt this project.