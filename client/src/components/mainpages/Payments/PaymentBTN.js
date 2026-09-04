import axios from 'axios';
import configURL from '../../../configURL';
import loadRazorpay from '../../../utils/loadRazorpay';

const PaymentBTN = ({ amount }) => {
  const handlePayment = async () => {
    try {
      await loadRazorpay();
      const res = await axios.post(`${configURL}/api/payment/create-order`, { amount });

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Strong Spark",
        description: "Test Payment",
        order_id: res.data.orderId,
        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
        },
        theme: { color: "#2C6EE0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment Failed");
      console.error(error);
    }
  };

  return <button onClick={handlePayment}>Pay ₹{amount}</button>;
};

export default PaymentBTN;
