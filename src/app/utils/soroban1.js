import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  Address,
  xdr,
} from "@stellar/stellar-sdk";
import { userSignTransaction } from "../utils/Freighter";

let rpcUrl = "https://soroban-testnet.stellar.org";
let contractAddress =
  "CADPNGQN4ISGNSCJVVY4TT22GRHB2JUSWKCM6GTHZOOMYGIBPE4PEAF3";

// Convert Account Address to ScVal form
const accountToScVal = (account) => new Address(account).toScVal();

// Convert String to ScVal form
const stringToScValString = (value) => nativeToScVal(value);

// Convert Number to U64 ScVal form
const numberToU64 = (value) => nativeToScVal(value, { type: "u64" });

// Convert Number to U32 ScVal form
const numberToU32 = (value) => nativeToScVal(value, { type: "u32" });

// Convert ScVal to JavaScript types
const scValToJs = (scVal) => {
  if (scVal.type === xdr.ScValType.scvU32()) {
    return scVal.u32();
  } else if (scVal.type === xdr.ScValType.scvU64()) {
    return scVal.u64().toString(); // convert to string to avoid JS number limitations
  } else if (scVal.type === xdr.ScValType.scvString()) {
    return scVal.str().toString();
  } else if (scVal.type === xdr.ScValType.scvAddress()) {
    return scVal.address().toString();
  } else if (scVal.type === xdr.ScValType.scvObject() && scVal.obj()) {
    // Handle other object types as needed
    return scVal.obj().toString();
  }
  // Handle other types as needed
  return null;
};

let params = {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
};

async function contractInt(caller, functName, values) {
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

  let prepareTx = _buildTx.toXDR(); // pre-encoding (converting it to XDR format)

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

// Function to add a post
async function addPost(
  caller,
  id,
  title,
  description,
  wallet_address,
  amount_requested,
  image_url
) {
  let idScVal = numberToU32(id);
  let titleScVal = stringToScValString(title);
  let descriptionScVal = stringToScValString(description);
  let walletAddressScVal = stringToScValString(wallet_address);
  let amountRequestedScVal = numberToU32(amount_requested);
  let imageUrlScVal = stringToScValString(image_url);

  let values = [
    idScVal,
    titleScVal,
    descriptionScVal,
    walletAddressScVal,
    amountRequestedScVal,
    imageUrlScVal,
  ];

  try {
    const result = await contractInt(caller, "add_post", values);
    console.log(`Post with ID ${id} added successfully!`);
    console.log(result);
    
    return result;
  } catch (error) {
    console.error("Failed to add post:", error);
  }
}

// Function to get all posts
async function getPosts(caller) {
  try {
    let result = await contractInt(caller, "get_posts", null);
    console.log(result);
    
    let posts = result?._value || [];
    let postsArray = [];

    for (let post of posts) {
      // Extract and convert values from the result
      let id = scValToJs(post?._attributes?.id);
      let title = scValToJs(post?._attributes?.title);
      let description = scValToJs(post?._attributes?.description);
      let walletAddress = scValToJs(post?._attributes?.wallet_address);
      let amountRequested = scValToJs(post?._attributes?.amount_requested);
      let amountReceived = scValToJs(post?._attributes?.amount_received);
      let imageUrl = scValToJs(post?._attributes?.image_url);

      // Create a post object and add it to the array
      postsArray.push({
        id,
        title,
        description,
        walletAddress,
        amountRequested,
        amountReceived,
        imageUrl,
      });
    }

    return postsArray;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

// Function to delete a post by ID
async function deletePost(caller, id) {
  let idScVal = numberToU32(id); // Convert ID to ScVal format

  try {
    // Call the smart contract's delete function
    const result = await contractInt(caller, "delete_post", idScVal);
    console.log(`Post with ID ${id} deleted successfully!`);
    console.log(result);

    return result;
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}

export { addPost, getPosts, deletePost };
