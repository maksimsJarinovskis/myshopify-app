const postContainer = document.querySelector('#inst_posts');
const requestUrl = "https://task6-test.myshopify.com/admin/api/2023-07/graphql.json";
const token = "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";

try {
  const appInstallationQuery ={
    query: `query {
      currentAppInstallation {
        id
      }
    }`
  }

  const appInstallationResponse = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(appInstallationQuery)
  });
  const appInstallationJson = await appInstallationResponse.json();
  const appInstallationId = appInstallationJson?.data?.currentAppInstallation?.id;

  if (appInstallationId) {
    const query = {
      query: `query AppInstallationMetafields {
      appInstallation(id: "${appInstallationId}") {
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
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(query)
    });
    const responseBody = await response.json();
    const metafields = responseBody?.data?.appInstallation?.metafields?.edges;

    const index = metafields.findIndex((metafield) => metafield.node.key === 'facebook_api_key');

    if( index === -1) throw new Error('Metafield not found');
    const apiKey = metafields[index].node.value;

    const postsResponse = await fetch("https://jsonplaceholder.typicode.com/posts", {
      headers: {
        "x-api-key": apiKey //faking the facebook api key
      }
    });
    const posts = await postsResponse.json();

    console.log(posts);
    posts.slice(0,3).forEach(
      (post) => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
        `;
        postContainer.appendChild(postElement);
      }
    )
  } else {
    throw new Error('App installation not found');
  }
} catch (error) {
  console.error('Error:', error);
  alert('An error occurred. Please try again later. ' + error.message);
}
