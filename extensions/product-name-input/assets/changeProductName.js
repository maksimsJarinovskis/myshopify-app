
const form = document.querySelector("#change-product-name");
const requestUrl = "https://task6-test.myshopify.com/admin/api/2023-07/graphql.json";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("start");

  try {
    const formData = new FormData(form);
    const productId = formData.get("product_id");
    const newTitle = formData.get("product_name");

    const query = {
      query: `mutation { productUpdate(input: {id: \"gid://shopify/Product/${productId}\", title: \"${newTitle}\"}) { product { id, title } } }`
    }
    console.log(JSON.stringify(query));

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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'
      },
      body: JSON.stringify(query)
    });
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again later. ' + error.message);
  }
})
