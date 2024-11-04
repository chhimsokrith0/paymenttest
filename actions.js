const { initializeCheckitout } = require('./services/checkitout');
const db = require('./config/db');

const createPayment = async (product) => {
  try {
    const checkitout = await initializeCheckitout();
    
    if (!checkitout) {
      throw new Error("Checkitout API could not be initialized");
    }

    const checkout = await checkitout.create({
      client: {
        name: 'Customer Name',
        phone: 'Customer Phone',
        address: 'Customer Address',
      },
      tax: 0,
      currency: "KHR",
      discount: { type: "PERCENTAGE", value: 0 },
      redirectUrl: "https://paymenttest-jhen.onrender.com",
      items: [
        {
          quantity: 1,
          price: product.price,
          productId: product.productId,
          img: product.image ? `https://paymenttest-jhen.onrender.com${product.image}` : 'https://via.placeholder.com/150',
          name: product.name,
        },
      ],
      additionalInfo: { id: product.id, description: product.description },
    });

    if (checkout.error) {
      console.error("Checkout error:", checkout.error);
      throw new Error("Error creating checkout: " + checkout.error.message);
    }

    const checkoutUrl = checkitout.getCheckoutUrl(checkout.data.checkout.id);
    return { url: checkoutUrl };

  } catch (error) {
    console.error("Payment creation error:", error);
    return { error: error.message || "Unknown error during payment creation" };
  }
};

module.exports = {
  createPayment,
};
