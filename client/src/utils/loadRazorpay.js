let razorpayLoader;

const loadRazorpay = () => {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (!razorpayLoader) {
    razorpayLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        razorpayLoader = undefined;
        reject(new Error('Unable to load Razorpay checkout'));
      };
      document.body.appendChild(script);
    });
  }

  return razorpayLoader;
};

export default loadRazorpay;