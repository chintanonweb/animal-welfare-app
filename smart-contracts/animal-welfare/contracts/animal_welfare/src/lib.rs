#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, log, Env, String, Symbol, Vec};
#[allow(unused_mut)]
#[contracttype]
#[derive(Clone)]
pub struct Post {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub wallet_address: String,
    pub amount_requested: u32,
    pub amount_received: u32,
    pub image_url: String,
}

#[contracttype]
#[derive(Clone)]
pub struct Donation {
    pub donor: String,
    pub amount: u32,
}

#[contract]
pub struct HelloWorld;

#[contractimpl]
impl HelloWorld {
    pub fn add_post(
        env: Env,
        id: u32,
        title: String,
        description: String,
        wallet_address: String,
        amount_requested: u32,
        image_url: String,
    ) {
        // Check if the 'posts' key exists, and if not, initialize it
        let mut posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or_else(|| Vec::new(&env));
    
        // Create a new post
        let post = Post {
            id,
            title,
            description,
            wallet_address,
            amount_requested,
            amount_received: 0,
            image_url,
        };
    
        // Add the post to the vector
        posts.push_back(post);
    
        // Save the updated posts vector back to storage
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "posts"), &posts);
    
        // Log success
        log!(&env, "Post with ID: {} added successfully.", id);
    }
    

    pub fn delete_post(env: Env, id: u32) {
        let posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or(Vec::new(&env));
        let mut filtered_posts = Vec::new(&env);

        let mut found = false;
        for post in posts.iter() {
            if post.id != id {
                filtered_posts.push_back(post.clone());
            } else {
                found = true;
            }
        }

        if found {
            env.storage()
                .instance()
                .set(&Symbol::new(&env, "posts"), &filtered_posts);
            log!(&env, "Post with ID: {} deleted successfully.", id);
        } else {
            log!(&env, "Cannot delete Post with ID: {}. Post not found.", id);
            panic!("Cannot delete Post. Post not found.");
        }
    }

    pub fn update_post(env: Env, id: u32, new_title: String, new_description: String) {
        let posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or(Vec::new(&env));
        let mut updated = false;

        let mut updated_posts = Vec::new(&env);

        for post in posts.iter() {
            if post.id == id {
                let mut updated_post = post.clone();
                updated_post.title = new_title.clone();
                updated_post.description = new_description.clone();
                updated_posts.push_back(updated_post);
                updated = true;
            } else {
                updated_posts.push_back(post.clone());
            }
        }

        if updated {
            env.storage()
                .instance()
                .set(&Symbol::new(&env, "posts"), &updated_posts);
            log!(&env, "Post with ID: {} updated successfully.", id);
        } else {
            log!(&env, "Cannot update Post with ID: {}. Post not found.", id);
            panic!("Cannot update Post. Post not found.");
        }
    }

    pub fn get_posts(env: Env) -> Vec<Post> {
        env.storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or(Vec::new(&env))
    }

    pub fn donate(env: Env, post_id: u32, donor: String, amount: u32) {
        let mut donations: Vec<Donation> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "donations"))
            .unwrap_or(Vec::new(&env));
        let donation = Donation { donor, amount };
        donations.push_back(donation);
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "donations"), &donations);

        // Update post's amount_received
        let posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or(Vec::new(&env));
        let mut updated_posts = Vec::new(&env);

        let mut post_found = false;

        for post in posts.iter() {
            if post.id == post_id {
                let mut updated_post = post.clone();
                updated_post.amount_received += amount;
                updated_posts.push_back(updated_post);
                post_found = true;
            } else {
                updated_posts.push_back(post.clone());
            }
        }

        if post_found {
            env.storage()
                .instance()
                .set(&Symbol::new(&env, "posts"), &updated_posts);
            log!(
                &env,
                "Donation of {} added to Post with ID: {}.",
                amount,
                post_id
            );
        } else {
            log!(
                &env,
                "Cannot donate to Post with ID: {}. Post not found.",
                post_id
            );
            panic!("Cannot donate. Post not found.");
        }
    }

    pub fn get_donations(env: Env, post_id: u32) -> Vec<Donation> {
        let donations: Vec<Donation> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "donations"))
            .unwrap_or(Vec::new(&env));
        let mut post_donations = Vec::new(&env);

        let posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or(Vec::new(&env));

        if let Some(_post) = posts.iter().find(|p| p.id == post_id) {
            for donation in donations.iter() {
                post_donations.push_back(donation.clone());
            }
        } else {
            log!(&env, "Cannot find Post with ID: {}.", post_id);
            panic!("Post not found.");
        }

        log!(&env, "Retrieved donations for Post with ID: {}.", post_id);
        post_donations
    }

    pub fn view_post_by_id(env: Env, post_id: u32) -> Post {
        let posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&Symbol::new(&env, "posts"))
            .unwrap_or(Vec::new(&env));
        if let Some(post) = posts.iter().find(|p| p.id == post_id) {
            log!(&env, "Post with ID: {} retrieved successfully.", post_id);
            post.clone()
        } else {
            log!(&env, "Cannot find Post with ID: {}.", post_id);
            panic!("Post not found.");
        }
    }
}
