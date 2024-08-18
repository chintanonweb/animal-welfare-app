#![allow(non_snake_case)]
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, log, symbol_short, Env, String, Symbol, Vec,
};

// Struct to represent a post in the animal welfare app
#[contracttype]
#[derive(Clone)]
pub struct Post {
    pub id: u64,                // Unique ID for the post
    pub title: String,          // Title of the post
    pub description: String,    // Description of the post
    pub amount_requested: u64,  // Amount of donation requested
    pub amount_received: u64,   // Amount of donation received
    pub image_url: String,      // URL to an image representing the post
    pub feeder_address: String, // Address of the feeder who created the post
    pub is_active: bool,        // Indicates if the post is still active
}

// Enum for referencing post storage
#[contracttype]
pub enum Postbook {
    Post(u64),
}

// Symbol to track the total count of posts
const COUNT_POST: Symbol = symbol_short!("C_POST");

// Define a constant for extended TTL (e.g., 100,000 blocks)
const EXTENDED_TTL: u32 = 100_000;

#[contract]
pub struct AnimalWelfareContract;

#[contractimpl]
impl AnimalWelfareContract {
    // Function to create a new post
    pub fn create_post(
        env: Env,
        title: String,
        description: String,
        amount_requested: u64,
        image_url: String,
        feeder_address: String,
    ) -> u64 {
        let mut count_post: u64 = env.storage().instance().get(&COUNT_POST).unwrap_or(0);
        count_post += 1;

        // Create a new post with the provided details
        let new_post = Post {
            id: count_post,
            title,
            description,
            amount_requested,
            amount_received: 0,
            image_url,
            feeder_address,
            is_active: true,
        };

        // Store the new post in the contract's storage with extended TTL
        env.storage()
            .instance()
            .set(&Postbook::Post(new_post.id.clone()), &new_post);
        env.storage().instance().set(&COUNT_POST, &count_post);
        env.storage()
            .instance()
            .extend_ttl(EXTENDED_TTL, EXTENDED_TTL);

        log!(&env, "Post Created with ID: {}", new_post.id);

        // Return the ID of the newly created post
        new_post.id
    }

    // Function to get a post by its ID
    pub fn get_post_by_id(env: Env, post_id: u64) -> Post {
        let key = Postbook::Post(post_id);

        // Retrieve the post from storage, return default values if not found
        env.storage().instance().get(&key).unwrap_or(Post {
            id: 0,
            title: String::from_str(&env, "Not Found"),
            description: String::from_str(&env, "Not Found"),
            amount_requested: 0,
            amount_received: 0,
            image_url: String::from_str(&env, ""),
            feeder_address: String::from_str(&env, ""),
            is_active: false,
        })
    }

    // Function to update a post by its ID
    pub fn update_post(
        env: Env,
        post_id: u64,
        new_title: Option<String>,
        new_description: Option<String>,
        new_amount_requested: Option<u64>,
        new_image_url: Option<String>,
        deactivate: bool,
    ) {
        let key = Postbook::Post(post_id);
        let mut post = Self::get_post_by_id(env.clone(), post_id);

        // Update fields if new values are provided
        if let Some(title) = new_title {
            post.title = title;
        }
        if let Some(description) = new_description {
            post.description = description;
        }
        if let Some(amount_requested) = new_amount_requested {
            post.amount_requested = amount_requested;
        }
        if let Some(image_url) = new_image_url {
            post.image_url = image_url;
        }

        // Directly assign the deactivate value to post.is_active
        post.is_active = !deactivate;

        // Store the updated post back in the contract's storage with extended TTL
        env.storage().instance().set(&key, &post);
        env.storage()
            .instance()
            .extend_ttl(EXTENDED_TTL, EXTENDED_TTL);

        log!(&env, "Post with ID: {} has been updated.", post_id);
    }

    // Function to get all posts
    pub fn get_all_posts(env: Env) -> Vec<Post> {
        let count_post: u64 = env.storage().instance().get(&COUNT_POST).unwrap_or(0);
        let mut posts = Vec::new(&env);

        for i in 1..=count_post {
            let post = Self::get_post_by_id(env.clone(), i);
            posts.push_back(post);
        }

        posts
    }

    // Function to delete a post by its ID
    pub fn delete_post(env: Env, post_id: u64) {
        let key = Postbook::Post(post_id);
        let mut post = Self::get_post_by_id(env.clone(), post_id);

        // Update the post to be inactive instead of removing it
        post.is_active = false;

        // Store the updated post back in the contract's storage with extended TTL
        env.storage().instance().set(&key, &post);
        env.storage()
            .instance()
            .extend_ttl(EXTENDED_TTL, EXTENDED_TTL);

        log!(
            &env,
            "Post with ID: {} has been deleted (marked inactive).",
            post_id
        );
    }

    // Function to permanently delete a post by its ID
    pub fn delete_post_permanently(env: Env, post_id: u64) {
        let key = Postbook::Post(post_id);

        // Check if the post exists before deleting
        if env.storage().instance().has(&key) {
            // Remove the post from storage
            env.storage().instance().remove(&key);

            // Update the total post count
            let mut count_post: u64 = env.storage().instance().get(&COUNT_POST).unwrap_or(0);
            if count_post > 0 {
                count_post -= 1;
                env.storage().instance().set(&COUNT_POST, &count_post);
            }

            log!(
                &env,
                "Post with ID: {} has been permanently deleted.",
                post_id
            );
        } else {
            log!(&env, "Post with ID: {} does not exist.", post_id);
        }
    }

    // Function to delete all posts
    pub fn delete_all_posts(env: Env) {
        let count_post: u64 = env.storage().instance().get(&COUNT_POST).unwrap_or(0);

        // Iterate over all posts and delete them
        for i in 1..=count_post {
            let key = Postbook::Post(i);
            env.storage().instance().remove(&key);
        }

        // Reset the post count to zero
        env.storage().instance().set(&COUNT_POST, &0);

        log!(&env, "All posts have been permanently deleted.");
    }

    // Function to donate to a post and update the amount received
    pub fn donate(env: Env, post_id: u64, amount: u64) {
        let key = Postbook::Post(post_id);
        let mut post = Self::get_post_by_id(env.clone(), post_id);

        // Update the amount received
        post.amount_received += amount;

        // Store the updated post back in the contract's storage with extended TTL
        env.storage().instance().set(&key, &post);
        env.storage()
            .instance()
            .extend_ttl(EXTENDED_TTL, EXTENDED_TTL);

        log!(
            &env,
            "Donation of {} received for Post ID: {}.",
            amount,
            post_id
        );
    }
}
