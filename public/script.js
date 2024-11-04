// Open the modal
function openModal() {
  document.getElementById('product-modal').style.display = 'flex';
}

// Close the modal
function closeModal() {
  document.getElementById('product-modal').style.display = 'none';
}

// Fetch and display products as cards
async function fetchProducts() {
  const response = await fetch('http://localhost:3000/api/products');
  const products = await response.json();
  const productList = document.getElementById('product-list');

  productList.innerHTML = ''; // Clear existing products

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    // Determine the status color and text
    const statusColor = product.status === 'PENDING' ? 'red' : 'green';
    const statusText = product.status === 'PENDING' ? 'Pending' : 'Paid';

    productCard.innerHTML = `
      <img src="${product.image || 'default-image.jpg'}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">៛${product.price}</p>
      <p><strong>Product ID:</strong> ${product.productId}</p>
      <p><strong>Status:</strong> <span class="status-label" style="background-color: ${statusColor}; color: white; padding: 5px 10px; border-radius: 5px;">${statusText}</span></p>
      ${
        product.status === 'SUCCESS'
          ? '' // Hide the button if status is SUCCESS
          : `<button onclick="payForProduct(${product.id})" class="pay-button">Pay</button>`
      }
    `;
    productList.appendChild(productCard);
  });
}


// Add a new product and close the modal
async function addProduct() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const productId = document.getElementById('productId').value;
  const image = document.getElementById('image').files[0];

  // Create a FormData object to handle multipart form data
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('productId', productId);
  formData.append('status', 'PENDING'); // Set default status to 'PENDING'
  if (image) {
    formData.append('image', image); // Add image to FormData
  }

  const response = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    alert('Product added successfully');
    closeModal(); // Close the modal after adding the product
    fetchProducts(); // Refresh product list
  } else {
    alert('Error adding product');
  }
}

// Function to handle payment for a product
async function payForProduct(productId) {
  try {
    const response = await fetch('http://localhost:3000/api/products/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: productId }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.url) {
        window.location.href = result.url; // Redirect to payment URL
      } else {
        alert('Failed to initiate payment');
      }
    } else {
      alert('Error initiating payment');
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('An error occurred during payment');
  }
}

// Initial fetch of products
fetchProducts();
