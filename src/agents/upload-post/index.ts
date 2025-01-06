import {
  Annotation,
  END,
  LangGraphRunnableConfig,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { TwitterClient } from "../../clients/twitter/client.js";
import { imageUrlToBuffer } from "../utils.js";
import { CreateMediaRequest } from "../../clients/twitter/types.js";
import { LinkedInClient } from "../../clients/linkedin.js";
import {
  LINKEDIN_ACCESS_TOKEN,
  LINKEDIN_ORGANIZATION_ID,
  LINKEDIN_PERSON_URN,
  POST_TO_LINKEDIN_ORGANIZATION,
} from "../generate-post/constants.js";

async function getMediaFromImage(image?: {
  imageUrl: string;
  mimeType: string;
}): Promise<CreateMediaRequest | undefined> {
  if (!image) return undefined;
  const { buffer, contentType } = await imageUrlToBuffer(image.imageUrl);
  return {
    media: buffer,
    mimeType: contentType,
  };
}

const UploadPostAnnotation = Annotation.Root({
  post: Annotation<string>,
  image: Annotation<
    | {
        imageUrl: string;
        mimeType: string;
      }
    | undefined
  >,
});

const UploadPostGraphConfiguration = Annotation.Root({
  [POST_TO_LINKEDIN_ORGANIZATION]: Annotation<boolean | undefined>,
});

export async function uploadPost(
  state: typeof UploadPostAnnotation.State,
  config: LangGraphRunnableConfig,
): Promise<Partial<typeof UploadPostAnnotation.State>> {
  throw new Error("DO NOT POST");
  // if (!state.post) {
  //   throw new Error("No post text found");
  // }
  // const twitterUserId = process.env.TWITTER_USER_ID;
  // const linkedInUserId = process.env.LINKEDIN_USER_ID;

  // if (!twitterUserId && !linkedInUserId) {
  //   throw new Error("One of twitterUserId or linkedInUserId must be provided");
  // }

  // const twitterToken = process.env.TWITTER_TOKEN;
  // const twitterTokenSecret = process.env.TWITTER_USER_TOKEN_SECRET;

  // if (twitterUserId) {
  //   if (!twitterToken || !twitterTokenSecret) {
  //     throw new Error(
  //       "Twitter token or token secret not found in configurable fields.",
  //     );
  //   }

  //   const twitterClient = await TwitterClient.fromUserId(twitterUserId, {
  //     twitterToken,
  //     twitterTokenSecret,
  //   });
  //   const mediaBuffer = await getMediaFromImage(state.image);

  //   await twitterClient.uploadTweet({
  //     text: state.post,
  //     ...(mediaBuffer && { media: mediaBuffer }),
  //   });
  //   console.log("✅ Successfully uploaded Tweet ✅");
  // } else {
  //   console.log("❌ Not uploading Tweet ❌");
  // }

  // if (linkedInUserId) {
  //   const linkedInClient = new LinkedInClient({
  //     accessToken: config.configurable?.[LINKEDIN_ACCESS_TOKEN],
  //     personUrn: config.configurable?.[LINKEDIN_PERSON_URN],
  //     organizationId: config.configurable?.[LINKEDIN_ORGANIZATION_ID],
  //   });

  //   const postToOrg =
  //     config.configurable?.[POST_TO_LINKEDIN_ORGANIZATION] != null
  //       ? JSON.parse(config.configurable?.[POST_TO_LINKEDIN_ORGANIZATION])
  //       : false;

  //   if (state.image) {
  //     await linkedInClient.createImagePost(
  //       {
  //         text: state.post,
  //         imageUrl: state.image.imageUrl,
  //       },
  //       {
  //         postToOrganization: postToOrg,
  //       },
  //     );
  //   } else {
  //     await linkedInClient.createTextPost(state.post, {
  //       postToOrganization: postToOrg,
  //     });
  //   }

  //   console.log("✅ Successfully uploaded post to LinkedIn ✅");
  // } else {
  //   console.log("❌ Not uploading post to LinkedIn ❌");
  // }

  // return {};
}

const uploadPostWorkflow = new StateGraph(
  UploadPostAnnotation,
  UploadPostGraphConfiguration,
)
  .addNode("uploadPost", uploadPost)
  .addEdge(START, "uploadPost")
  .addEdge("uploadPost", END);

export const uploadPostGraph = uploadPostWorkflow.compile();
uploadPostGraph.name = "Upload Post Graph";
