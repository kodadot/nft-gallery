exports.handler = async (event, context) => {
  const location = event.queryStringParameters.location || "home";

  console.log("Hello Angular World o(*ﾟ∇ﾟ)ﾉ");
  console.log(`\nHere is the event info: ${JSON.stringify(event)}`);
  console.log(`\nHere is the context info: ${JSON.stringify(context)}`);

  return {
    statusCode: 200,
    body: `Ng phone ${location}!`,
  };
};