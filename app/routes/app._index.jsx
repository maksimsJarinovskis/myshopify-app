import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({request}) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const requestJson = await request.json();
  const secretKey = requestJson.secret_key;
  if (secretKey) {
    //query {
    //   currentAppInstallation {
    //     id
    //   }
    // }
    const appInstalationQuery = await admin.graphql(
  `#graphql
        query {
          currentAppInstallation {
            id
          }
        }`
    );
    const appInstalationJson = await appInstalationQuery.json();
    const appInstalationId = appInstalationJson?.data?.currentAppInstallation?.id;
    console.log(appInstalationId);
    if (appInstalationId) {
      const response = await admin.graphql(
          `#graphql
        mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafieldsSetInput) {
            metafields {
              id
              namespace
              key
            }
            userErrors {
              field
              message
            }
          }
        }`,
        {
          variables: {
            "metafieldsSetInput": [
              {
                "namespace": "secret_keys",
                "key": "facebook_api_key",
                "type": "single_line_text_field",
                "value": secretKey,
                "ownerId": appInstalationId
              }
            ]
          }
        },
      );
      const responseJson = await response.json();

      console.log(responseJson.data.metafieldsSet.metafields[0]);
      return json({
        metafield: responseJson.data?.metafieldsSet?.metafields[0]
      });
    }
  }
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const secretKey = formData.get("secret_key");
    return submit({"secret_key": `${secretKey}`}, { replace: true, method: "POST", encType: "application/json"})
  }
  return (
    <Page>
      <form onSubmit={submitHandler}>
        <input type="text" name="secret_key"/>
        <button variant="primary" type="submit">
          Generate a product!!
        </button>
      </form>
    </Page>
  );
}
