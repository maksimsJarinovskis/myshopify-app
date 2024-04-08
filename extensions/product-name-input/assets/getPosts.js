const postContainer = document.querySelector('#inst_post');
const requestUrl = "https://task6-test.myshopify.com/admin/api/2023-07/graphql.json";

try {
  //TODO: Retreive appInstalation dynamically
  const query = {
    query: `query AppInstallationMetafields {
      appInstallation(id: "gid://shopify/AppInstallation/447847727240") {
        metafields(first: 5) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }`
  }



  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': "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"
    },
    body: JSON.stringify(query)
  });
  const responseBody = await response.json();
  console.log(responseBody);
} catch (error) {
  console.error('Error:', error);
  alert('An error occurred. Please try again later. ' + error.message);
}
