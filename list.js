import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  // const data = JSON.parse(event.body);

  const currentMonth = (new Date()).toISOString().slice(0, 7);
  const params = {
    TableName: "si-posts",
    IndexName: "allPostsIndex",
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user
    KeyConditionExpression: "monthCreated = :fromMonth",
    ExpressionAttributeValues: {
      ":fromMonth": currentMonth,
    },
    Limit: 20,
    ScanIndexForward: false
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
