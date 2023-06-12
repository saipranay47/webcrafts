const sdk = require("node-appwrite");
const slugify = require("slugify");

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // Initialize Appwrite services
  const database = new sdk.Databases(client);

  // Retrieve function variables
  const { tags } = JSON.parse(req.payload);
  const tagCollectionId = req.variables["APPWRITE_TAGS_COLLECTION_ID"];
  const databaseId = req.variables["APPWRITE_DATABASE_ID"];

  if (
    !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
    !req.variables["APPWRITE_FUNCTION_API_KEY"]
  ) {
    console.warn(
      "Environment variables are not set. Function cannot use Appwrite SDK."
    );
  } else {
    client
      .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
      .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
      .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
      .setSelfSigned(true);

    tags.forEach(async (tag) => {
      const tagId = slugify(tag, {
        lower: true,
        remove: /[^a-zA-Z0-9]/g, // Remove special characters and spaces
      });

      try {
        await database.createDocument(databaseId, tagCollectionId, tagId,{
          tag: tag,
          count: 0,
        });

        console.log(`Tag "${tag}" added successfully.`);
      } catch (error) {
        console.error(`Error adding tag "${tag}":`, error);
      }
    });

    res.send("Tags added successfully.");
  }
};
