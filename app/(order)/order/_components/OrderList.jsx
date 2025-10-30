/** @format */

import OrderCard from "./OrderCard";

const OrderList = ({ orders }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
