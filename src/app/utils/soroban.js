import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";
import { userSignTransaction } from "../utils/Freighter";

let rpcUrl = "https://soroban-testnet.stellar.org";

let contractAddress =
  "CADDQMSNMHHEU6SWMD3BLWPCTSQ44TNCPOUZ2VRXGSZM4DPSGJPLNFA3";

// Convert Account Address to ScVal form
const accountToScVal = (account) => new Address(account).toScVal();

// Convert String to ScVal form
const stringToScValString = (value) => nativeToScVal(value);

// Convert Number to U64 ScVal
const numberToU64 = (value) => nativeToScVal(value, { type: "u64" });

let params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
};

// Function to interact with the smart contract
// async function contractInt(caller, functName, values) {
//   const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
//   const sourceAccount = await provider.getAccount(caller);
//   const contract = new Contract(contractAddress);
//   let buildTx;

//   if (values == null) {
//     buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName))
//       .setTimeout(30)
//       .build();
//   } else if (Array.isArray(values)) {
//     buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName, ...values))
//       .setTimeout(30)
//       .build();
//   } else {
//     buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName, values))
//       .setTimeout(30)
//       .build();
//   }

//   let _buildTx = await provider.prepareTransaction(buildTx);

//   let prepareTx = _buildTx.toXDR(); // Pre-encoding (converting it to XDR format)

//   let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);

//   let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);

//   try {
//     let sendTx = await provider.sendTransaction(tx).catch(function (err) {
//       console.error("Catch-1", err);
//       return err;
//     });
//     if (sendTx.errorResult) {
//       throw new Error("Unable to submit transaction");
//     }
//     if (sendTx.status === "PENDING") {
//       let txResponse = await provider.getTransaction(sendTx.hash);
//       // Continuously checking the transaction status until it gets successfully added to the blockchain ledger or it gets rejected
//       while (txResponse.status === "NOT_FOUND") {
//         txResponse = await provider.getTransaction(sendTx.hash);
//         await new Promise((resolve) => setTimeout(resolve, 100));
//       }
//       if (txResponse.status === "SUCCESS") {
//         let result = txResponse.returnValue;
//         return result;
//       }
//     }
//   } catch (err) {
//     console.log("Catch-2", err);
//     return;
//   }
// }
async function contractInt(caller, functName, values) {
  // ... (keep this function unchanged)
  const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
  const sourceAccount = await provider.getAccount(caller);
  const contract = new Contract(contractAddress);
  let buildTx;

  if (values == null) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName))
      .setTimeout(30)
      .build();
  } else if (Array.isArray(values)) {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, ...values))
      .setTimeout(30)
      .build();
  } else {
    buildTx = new TransactionBuilder(sourceAccount, params)
      .addOperation(contract.call(functName, values))
      .setTimeout(30)
      .build();
  }

  let _buildTx = await provider.prepareTransaction(buildTx);

  let prepareTx = _buildTx.toXDR(); 

  let signedTx = await userSignTransaction(prepareTx, "TESTNET", caller);

  let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);

  try {
    let sendTx = await provider.sendTransaction(tx).catch(function (err) {
      console.error("Catch-1", err);
      return err;
    });
    if (sendTx.errorResult) {
      throw new Error("Unable to submit transaction");
    }
    if (sendTx.status === "PENDING") {
      let txResponse = await provider.getTransaction(sendTx.hash);
      
      while (txResponse.status === "NOT_FOUND") {
        txResponse = await provider.getTransaction(sendTx.hash);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (txResponse.status === "SUCCESS") {
        let result = txResponse.returnValue;
        return result;
      }
    }
  } catch (err) {
    console.log("Catch-2", err);
    return;
  }
}

// Function to create a new post
async function createPost(
  caller,
  title,
  description,
  amountRequested,
  imageUrl,
  feederAddress
) {
  let titleScVal = stringToScValString(title);
  let descriptionScVal = stringToScValString(description);
  let amountRequestedScVal = numberToU64(amountRequested);
  let imageUrlScVal = stringToScValString(imageUrl);
  let feederAddressScVal = stringToScValString(feederAddress);
  const values = [
    titleScVal,
    descriptionScVal,
    amountRequestedScVal,
    imageUrlScVal,
    feederAddressScVal,
  ];

  try {
    const postId = await contractInt(caller, "create_post", values);
    let resolvedPostId = Number(postId?._value?._value);
    console.log(`Post ID - ${resolvedPostId}, is Created!!`);
    return resolvedPostId;
  } catch (error) {
    console.log("Post not created. Check if you already have an active post.");
  }
}

// Function to get a post by its ID
async function getPostById(caller, postId) {
  let values = numberToU64(postId);

  try {
    let result = await contractInt(caller, "get_post_by_id", values);

    // Extract values from result
    let id = Number(result?._value[4]?._attributes?.val?._value);
    let title = result?._value[7]?._attributes?.val?._value?.toString();
    let description = result?._value[2]?._attributes?.val?._value?.toString();
    let amountRequested = Number(result?._value[1]?._attributes?.val?._value);
    let amountReceived = Number(result?._value[0]?._attributes?.val?._value);
    let imageUrl = result?._value[5]?._attributes?.val?._value?.toString();
    let feederAddress = result?._value[3]?._attributes?.val?._value?.toString();
    let isActive = result?._value[6]?._attributes?.val?._value;

    console.log({
      id,
      title,
      description,
      amountRequested,
      amountReceived,
      imageUrl,
      feederAddress,
      isActive,
    });

    return {
      id,
      title,
      description,
      amountRequested,
      imageUrl,
      amountReceived,
      feederAddress,
      isActive,
    };
  } catch (error) {
    console.log("Unable to fetch post details.");
  }
}

// Function to get all posts
async function getAllPosts(caller) {
  try {
    let result = await contractInt(caller, "get_all_posts", null);
    let posts = result?._value.map((post) => ({
      id: Number(post?._value[4]?._attributes?.val?._value),
      title: post?._value[7]?._attributes?.val?._value?.toString(),
      description: post?._value[2]?._attributes?.val?._value?.toString(),
      amountRequested: Number(post?._value[1]?._attributes?.val?._value),
      amountReceived: Number(post?._value[0]?._attributes?.val?._value),
      imageUrl: post?._value[5]?._attributes?.val?._value?.toString(),
      feederAddress: post?._value[3]?._attributes?.val?._value?.toString(),
      isActive: post?._value[6]?._attributes?.val?._value,
    }));

    console.log(posts);

    return posts;
  } catch (error) {
    console.log("Unable to fetch all posts.");
  }
}

// Function to update a post
async function updatePost(
  caller,
  postId,
  newTitle = null,
  newDescription = null,
  newAmountRequested = null,
  newImageUrl = null,
  deactivate = false
) {
  let postIdScVal = numberToU64(postId);
  let newTitleScVal = newTitle ? stringToScValString(newTitle) : null;
  let newDescriptionScVal = newDescription ? stringToScValString(newDescription) : null;
  let newAmountRequestedScVal = newAmountRequested ? numberToU64(newAmountRequested) : null;
  let newImageUrlScVal = newImageUrl ? stringToScValString(newImageUrl) : null;
  let deactivateScVal = nativeToScVal(deactivate, { type: "bool" });

  const values = [
    postIdScVal,
    newTitleScVal,
    newDescriptionScVal,
    newAmountRequestedScVal,
    newImageUrlScVal,
    deactivateScVal
  ];

  try {
    await contractInt(caller, "update_post", values);
    console.log(`Post ID - ${postId}, has been updated!`);
  } catch (error) {
    console.log("Unable to update post. Please check the provided details.");
  }
}

// Function to delete a post by its ID
async function deletePost(caller, postId) {
  let postIdScVal = numberToU64(postId);

  try {
    await contractInt(caller, "delete_post", postIdScVal);
    console.log(`Post ID - ${postId}, has been deleted!`);
  } catch (error) {
    console.log("Unable to delete post. Please ensure the post exists.");
  }
}

// Function to delete a post by its ID
async function deletePostPermanently(caller, postId) {
  let postIdScVal = numberToU64(postId);

  try {
    await contractInt(caller, "delete_post_permanently", postIdScVal);
    console.log(`Post ID - ${postId}, has been deleted!`);
  } catch (error) {
    console.log("Unable to delete post. Please ensure the post exists.");
  }
}

// Function to donate to a post by its ID
async function donate(caller, postId, amount) {
  let postIdScVal = numberToU64(postId);
  let amountScVal = numberToU64(amount);

  const values = [postIdScVal, amountScVal];

  try {
    await contractInt(caller, "donate", values);
    console.log(`Donation of ${amount} to Post ID - ${postId} was successful!`);
  } catch (error) {
    console.log("Unable to donate. Please check the post ID and amount.");
  }
}



export { createPost, getPostById, getAllPosts, updatePost, deletePost, donate, deletePostPermanently};
