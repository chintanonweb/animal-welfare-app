import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";
import { userSignTransaction } from "./Freighter";

let rpcUrl = "https://soroban-testnet.stellar.org";
let contractAddress = "CCE7RGK75DYBB6AL5OQZTIXPQML3TC6DDSOH6AY2A6V3SEUF3VRH7WIC";

// Helper functions for conversions
const accountToScVal = (account) => new Address(account).toScVal();
const stringToScValString = (value) => nativeToScVal(value);
const numberToU64 = (value) => nativeToScVal(value, { type: "u64" });

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
  
  // Use the new SorobanRpc.assembleTransaction method
  let assembledTx = await SorobanRpc.assembleTransaction(_buildTx).catch(err => {
    console.error("Error assembling transaction:", err);
    throw err;
  });

  let signedTx = await userSignTransaction(assembledTx.toXDR(), "TESTNET", caller);
  let tx = TransactionBuilder.fromXDR(signedTx, Networks.TESTNET);

  try {
    let sendTx = await provider.sendTransaction(tx);

    if (sendTx.status === "PENDING") {
      let txResponse = await provider.getTransaction(sendTx.hash);
      while (txResponse.status === "NOT_FOUND") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        txResponse = await provider.getTransaction(sendTx.hash);
      }
      if (txResponse.status === "SUCCESS") {
        return txResponse.returnValue;
      }
    }
  } catch (err) {
    console.error("Transaction Failed:", err);
    throw err;
  }
}

// Smart contract function wrappers

async function addPost(caller, id, title, description, wallet_address, amount_requested, image_url) {
  let idScVal = numberToU64(id);
  let titleScVal = stringToScValString(title);
  let descriptionScVal = stringToScValString(description);
  let walletAddressScVal = stringToScValString(wallet_address);
  let amountRequestedScVal = numberToU64(amount_requested);
  let imageUrlScVal = stringToScValString(image_url);

  let values = [idScVal, titleScVal, descriptionScVal, walletAddressScVal, amountRequestedScVal, imageUrlScVal];
  await contractInt(caller, "add_post", values);
  console.log(`Post with ID: ${id} added successfully.`);
}

async function deletePost(caller, id) {
  let idScVal = numberToU64(id);
  await contractInt(caller, "delete_post", idScVal);
  console.log(`Post with ID: ${id} deleted successfully.`);
}

async function updatePost(caller, id, new_title, new_description) {
  let idScVal = numberToU64(id);
  let newTitleScVal = stringToScValString(new_title);
  let newDescriptionScVal = stringToScValString(new_description);

  let values = [idScVal, newTitleScVal, newDescriptionScVal];
  await contractInt(caller, "update_post", values);
  console.log(`Post with ID: ${id} updated successfully.`);
}

async function getPosts(caller) {
  try {
    const result = await contractInt(caller, "get_posts", null);
    if (!result || !result._value || !Array.isArray(result._value)) {
      console.error("Unexpected response format:", result);
      return [];
    }

    const posts = result._value.map(postMap => {
      if (!postMap || !postMap._value || !Array.isArray(postMap._value)) {
        console.error("Unexpected post format:", postMap);
        return null;
      }

      const postObj = {};
      postMap._value.forEach(item => {
        if (item && item._attributes && item._attributes.key && item._attributes.val) {
          const key = Buffer.from(item._attributes.key._value.data).toString();
          let value;
          if (item._attributes.val._arm === 'u32') {
            value = item._attributes.val._value;
          } else if (item._attributes.val._arm === 'str') {
            value = Buffer.from(item._attributes.val._value.data).toString();
          } else {
            console.warn(`Unexpected value type for ${key}:`, item._attributes.val);
            value = null;
          }
          postObj[key] = value;
        }
      });

      return {
        id: Number(postObj.id),
        title: postObj.title,
        description: postObj.description,
        imageUrl: postObj.image_url,
        amountRequested: Number(postObj.amount_requested),
        amountReceived: Number(postObj.amount_received),
        walletAddress: postObj.wallet_address
      };
    }).filter(post => post !== null);

    return posts;
  } catch (error) {
    console.error("Unable to fetch posts", error);
    throw error;
  }
}

async function donate(caller, post_id, donor, amount) {
  let postIdScVal = numberToU64(post_id);
  let donorScVal = stringToScValString(donor);
  let amountScVal = numberToU64(amount);

  let values = [postIdScVal, donorScVal, amountScVal];
  await contractInt(caller, "donate", values);
  console.log(`Donation of ${amount} to Post with ID: ${post_id} added successfully.`);
}

async function getDonations(caller, postId) {
  const values = numberToU64(postId);
  try {
    const result = await contractInt(caller, "get_donations", values);
    const donations = result?._value.map(donation => {
      return {
        donor: donation?._attributes?.val?._value[0]?.toString(),
        amount: Number(donation?._attributes?.val?._value[1]),
        timestamp: Number(donation?._attributes?.val?._value[2]),
      };
    });
    return donations;
  } catch (error) {
    console.log("Unable to fetch donations", error);
  }
}

async function viewPostById(caller, postId) {
  const values = numberToU64(postId);
  try {
    const result = await contractInt(caller, "view_post_by_id", values);
    const post = {
      id: Number(result?._value[0]?._attributes?.val?._value),
      title: result?._value[1]?._attributes?.val?._value?.toString(),
      description: result?._value[2]?._attributes?.val?._value?.toString(),
      imageUrl: result?._value[3]?._attributes?.val?._value?.toString(),
      amountRequested: Number(result?._value[4]?._attributes?.val?._value),
      amountReceived: Number(result?._value[5]?._attributes?.val?._value),
    };
    return post;
  } catch (error) {
    console.log("Unable to fetch post by ID", error);
  }
}

export {
  addPost,
  deletePost,
  updatePost,
  getPosts,
  donate,
  getDonations,
  viewPostById,
};
