/***////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////***/
/**
 * Space Invaders: Reboot
 * 
 * Author: Matt Fung
 * Development: June - July 2019
 * Language: JavaScript (ES6)
 */
/***////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////***/
/* Use Strict */
"use strict";

/* Canvas Globals */
let ctx;

/* Images */
let img_player = new Image(),
    img_lazer = new Image(),
    img_special_lazer = new Image(),
    img_missile = new Image(),
    img_shield = new Image(),
    img_explosion = new Image(),
    img_background = new Image(),
    img_type_1 = new Image(),
    img_type_2 = new Image(),
    img_type_3 = new Image(),
    img_type_4 = new Image(),
    img_type_5 = new Image(),
    img_enemy_lazer = new Image(),
    img_boss = new Image(),
    img_boss_lazer = new Image();

/* Player Sprites */
img_player.src = "spaceship.png";
img_lazer.src = "lazer_red.png";
img_special_lazer.src = "lazer_yellow.png";
img_missile.src = "rocket.png";
img_shield.src = "shield.png";

/* Enemy Sprites */
img_type_1.src = "type_1.png";
img_type_2.src = "type_2.png";
img_type_3.src = "type_3.png";
img_type_4.src = "type_4.png";
img_type_5.src = "type_5.png";
img_enemy_lazer.src = "lazer_green.png";

/* Boss Sprites */
img_boss.src = "boss.png";
img_boss_lazer.src = "lazer_blue.png";

/* Gamepage Sprites */
img_explosion.src = "explosion.png";
img_background.src = "vertical_background.png";

/* Player Globals */
let my_player,
    players_list = new Array(),
    shooting_interval = 300;

/* Projectile Globals */
let player_projectile,
    projectiles_list = new Array(),
    special_counter = 0,
    special_fire_interval;

/* Shield Globals */
let player_shield,
    shield_list = new Array();

/* Enemy Globals */
let my_enemy,
    enemies_list = new Array(),
    spawn_wave,
    type_4_5_flag = false;

/* Enemy Projectile Globals */
let enemy_projectile,
    enemy_projectiles_list = new Array();

/* Explosion Globals */
let collision_explosion,
    explosion_list = new Array();

/* Enemy Type 1 */
let type_1_can_gen = false,
    type_1_gen_interval = 1000;

// /* Enemy Type 2 */
let type_2_can_gen = false,
    type_2_gen_interval = 1000;

/* Enemy Type 3 */
let type_3_can_gen = false,
    type_3_gen_interval = 1000;

/* Enemy Type 4 */
let type_4_can_gen = false,
    type_4_gen_interval = 1000;

/* Enemy Type 5 */
let type_5_can_gen = false,
    type_5_gen_interval = 1000;

/* Enemy Boss */
let type_boss_can_gen = false,
    type_boss_gen_interval = 1000,
    health_check_1 = false,
    health_check_2 = false,
    shot_counter = 0;

/* Background Globals */
let background_width = 500,
    background_height = 850,
    background_x = 0,
    background_y = 0,
    distance_y = 0.75,
    img_width,
    img_height;

/* Block Globals */
let popup_title,
    popup_gameover,
    popup_you_win,
    popup_dev_name;

/* Canvas Surface Globals */
let canvas_surface = {
    canvas: document.createElement("canvas"),                                           // Create canvas for game

    /* This function intializes and sets up the game */
    initialize_game: function() 
    {
        this.canvas.width = 500;                                                        // Set width of the canvas
        this.canvas.height = 850;                                                       // Set height of the canvas
        this.canvas.style.display = 'inline-block';                                     // Set display type
        this.canvas.style.position = 'relative';                                        // Set the canvas to float in the middle of the page
        this.canvas.id = "canvas-container";                                            // Set id of the canvas
        document.getElementById("div-container").appendChild(canvas_surface.canvas);    // Appends canvas element to webpage
        this.context = this.canvas.getContext("2d");                                    // Set context of canvas
        this.interval = setInterval(update_canvas, 20);                                 // call update_canvas() every 20 milliseconds

        /* Setup keyboard events */
        window.addEventListener('keydown', function (event)                             // Set keydown property
        {
            canvas_surface.keys = (canvas_surface.keys || []);
            canvas_surface.keys[event.keyCode] = (event.type == "keydown");
        })
        window.addEventListener('keyup', function (event)                               // Set keyup property
        {
            canvas_surface.keys[event.keyCode] = (event.type == "keydown");
        })
        window.addEventListener("keydown", function (event)                             // Prevents arrow keys from scrolling
        {
            if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
                event.preventDefault();
            }
        }, false);
    },

    /* This function clears the canvas */
    reset_canvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /* This function stops the animation of the canas */
    stop_canvas: function() {
        clearInterval(this.interval);
    }
};

/* Queue Implementation */
class Queue 
{
    /* This constructor sets up the array for the queue */
    constructor() 
    {
        // Create default array
        this.queued_items = new Array();
    }
    /** This method mimics an enqueue function and adds a passed in parameter to the from to the front of the queue 
     * element_in is a templated parameter where its datatype depends on what is passed in when enqueue() is called
    */
    enqueue(element_in) 
    {
        // Add element_in to the front of the queue
        this.queued_items.push(element_in);
    }
    /* This method mimics a dequeue function and removes/returns the first item from the queue */
    dequeue() 
    {
        // Check if queue is empty
        if (this.is_empty())
            // Error message
            return "Error";
        // Return the first item in the queue and removes it
        return this.queued_items.shift();
    }
    /* This method mimics a front function and returns the first item from the queue */
    front() 
    {
        // Check if queue is empty
        if (this.is_empty())
            //  Error message
            return "No elements in Queue";
        // Return the first item in the queue
        return this.queued_items[0];
    } 
    /* This method mimics a is_empty function and checks if the queue is empty */
    is_empty() 
    {
        // Returns boolean for empty queue or not
        return this.queued_items.length == 0;
    }
    /* This method returns a string of all the items in the queue */
    output_queue() 
    {
        let output;

        // Iterate to output every item in the queue
        for (let i = 0; i < this.queued_items.length; i++)
            output += this.queued_items[i] + " ";
        // Return the output
        return output;
    }
    /* This method returns the length of the queue */
    len()
    {
        // Return the length of the queue
        return this.queued_items.length;
    }
}

/* Queue Globals */
let enemy_spawning_queue = new Queue(),
    current_wave,
    flag_spawn_wave = false,
    num_spawned = 0;

/***////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////***/
/*********************************************************************************************** Constructors *****************************************************************************************************************************************************************************************/

/**
 * Constructor: create_player()
 * 
 * -> This constructor creates a player when called
 * -> Assigns and sets up all the properties for the player
 * -> The passed in parameters of width, height, x and y are all assigned to their respective properties in the player object
 */
function create_player(width, height, x, y) 
{
    this.location = canvas_surface;                                                     // Assign the location of the player to be inside the canvas element
    this.width = width;                                                                 // Set the width of the player
    this.height = height;                                                               // Set the height of the player
    this.x_speed = 0;                                                                   // Set the horizontal speed of the player 
    this.y_speed = 0;                                                                   // Set the vertical speed of the player
    this.friction = 0.93;                                                               // Set the friction of the player
    this.x_pos = x;                                                                     // Set the x-coordinate of the player
    this.y_pos = y;                                                                     // Set the y-coordinate of the player
    this.health = 200;                                                                  // Set the health of the player
    this.can_fire = true;                                                               // Set whether the player can shoot or not
    this.missile = true;                                                                // Set whether the player can shoot rockets or not
    this.special_fire = true;                                                           // Set whehter the player can use the special or not
    this.rapid_fire = false;                                                            // Set whether the player can rapid fire or not
    this.shield = true;                                                                 // Set whether the player can use a shield or not

    /* This function draws the health bar of the player */
    this.health_bar = function()
    {
        ctx.fillStyle = "Chartreuse";
        ctx.fillRect(this.x_pos + 20, this.y_pos + 44, 30 * (this.health / 200), 3);
    }

    /* This function draws the weapons indicator of the player */
    this.weapons_online = function()
    {   
        if (this.special_fire)                                                          // If the player can use the special, set the indicator to be yellow
        {
            ctx.fillStyle = "Gold";
            ctx.fillRect(this.x_pos + 10, this.y_pos + 44, 3, 3);
        }
        else                                                                            // If not, set the indicator to red
        {
            ctx.fillStyle = "Red";
            ctx.fillRect(this.x_pos + 10, this.y_pos + 44, 3, 3);
        }
        if (this.missile)                                                               // If the player can shoot rockets, set the indicator to be blue
        {
            ctx.fillStyle = "DodgerBlue";
            ctx.fillRect(this.x_pos, this.y_pos + 44, 3, 3);
        }
        else                                                                            // If not, set the indicator to red
        {
            ctx.fillStyle = "Red";
            ctx.fillRect(this.x_pos, this.y_pos + 44, 3, 3);
        }
    }

    /* This function updates the position of the player */
    this.update_speed = function() 
    {
        this.x_pos += this.x_speed;
        this.y_pos += this.y_speed;
        player_check_bounds();                                                          // Calls player_check_bounds() to see if the player hits a canvas boundary
    }

    /* This function draws the player onto the canvas surface */
    this.update_movement = function() 
    {
        ctx = canvas_surface.context;
        ctx.drawImage(img_player, this.x_pos, this.y_pos);
    } 
}

/**
 * Constructor: create_shield
 *
 * -> This constructor creates a shield when called
 * -> Assigns and sets up all the properties for the shield
 * -> The passed in parameters of width, height, x and y are all assigned to their respective properties in the shield object
 */
function create_shield(width, height, x, y)
{
    this.location = canvas_surface;                                                     // Assign the location of the shield to be inside the canvas element
    this.width = width;                                                                 // Set the width of the shield
    this.height = height;                                                               // Set the height of the shield
    this.x_pos = x;                                                                     // Set the x-coordinate of the shield
    this.y_pos = y;                                                                     // Set the y-coordinate of the shield
    this.health = 100;                                                                  // Set the health of the shield
    this.visible = false;                                                               // Set the visibility of the shield

    /* This function updates the position of the shield */
    this.update_speed = function() 
    {
        this.x_pos = players_list[0].x_pos - 12.5;
        this.y_pos = players_list[0].y_pos - 20;
    }

    /* This function draws the shield onto the canvas surface */
    this.update_movement = function() 
    {
        ctx = canvas_surface.context;
        ctx.drawImage(img_shield, this.x_pos, this.y_pos);
    } 
}

/**
 * Constructor: create_enemy()
 *
 * -> This constructor creates an enemy when called
 * -> Assigns and sets up all the properties for the enemy
 * -> The passed in parameters of width, height, x, y, type, current_speed_x, current_speed_y, rapid_fire, fire_rate,
 * -> multi_rate, health and boss are all assigned to their respective properties in the enemy object
 */
function create_enemy(width, height, x, y, type, current_speed_x, current_speed_y, img_type, rapid_fire, fire_rate, multi_rate, health, boss)
{
    this.location = canvas_surface;                                                 // Assign the location of the enemy to be inside the canvas element
    this.width = width;                                                             // Set the width of the enemy
    this.height = height;                                                           // Set the height of the enemy
    this.x_speed = 0;                                                               // Set the horizontal speed of the enemy
    this.y_speed = 0;                                                               // Set the vertical speed of the enemy
    this.current_speed_x = current_speed_x;                                         // Set the current horizontal speed of the enemy
    this.current_speed_y = current_speed_y;                                         // Set the current vertical speed of the enemy
    this.x_pos = x;                                                                 // Set the x-coordinate of the enemy
    this.y_pos = y;                                                                 // Set the y-coordinate of the enemy
    this.health = health;                                                           // Set the health of the enemy
    this.health_bar_constant = health;                                              // Set the health tracker of the enemy
    this.boss = boss;                                                               // Set the enemy to be a boss or not
    this.can_fire = true;                                                           // Set whether the enemy can shoot or not
    this.alternate_fire = false;                                                    // Set whether the enemy can use the alternate shooting pattern or not
    this.rapid_fire = rapid_fire;                                                   // Set whether the enemy can rapid fire or not
    this.fire_rate = fire_rate;                                                     // Set the fire rate of the enemy
    this.multi_rate = multi_rate;                                                   // Set the multi rate of the enemy
    this.type = type                                                                // Set the enemy's type

    /* This function draws the health bar of the enemy */
    this.health_bar = function() 
    {
        ctx.fillStyle = "Chartreuse";
        ctx.fillRect(this.x_pos + this.width * 0.25, this.y_pos - 5, (this.width / 2) * (this.health / this.health_bar_constant), 3);
    }

    /* This function updates the position of the enemy */
    this.update_speed = function() 
    {
        this.x_pos += this.x_speed;
        this.y_pos += this.y_speed;
    }

    /* This function draws the enemy onto the canvas surface */
    this.update_movement = function() 
    {
        ctx = canvas_surface.context;
        ctx.drawImage(img_type, this.x_pos, this.y_pos);
    }
}

/**
 * Constructor: create_projectile()
 *
 * -> This constructor creates a projectile when called
 * -> Assigns and sets up all the properties for the projectile
 * -> The passed in parameters of width, height, x, y, img_type, x_speed and damage are all assigned to their respective properties in the projectile object
 */
function create_projectile(width, height, x, y, img_type, x_speed, damage)
{
    this.location = canvas_surface;                                                 // Assign the location of the projectile to be inside the canvas element
    this.width = width;                                                             // Set the width of the projectile
    this.height = height;                                                           // Set the height of the projectile
    this.x_speed = x_speed;                                                         // Set the horizontal speed of the projectile
    this.y_speed = 0;                                                               // Set the vertical speed of the projectile
    this.x_pos = x;                                                                 // Set the x-coordinate of the projectile
    this.y_pos = y;                                                                 // Set the y-coordinate of the projectile
    this.damage = damage;                                                           // Set the damage of the projectile

    /* This function updates the position of the projectile */
    this.update_speed = function()
    {
        this.x_pos += this.x_speed;
        this.y_pos += this.y_speed;
    }

    /* This function draws the projectile onto the canvas surface */
    this.update_movement = function()
    {
        ctx = canvas_surface.context;
        ctx.drawImage(img_type, this.x_pos, this.y_pos);
    }
}

/**
 * Constructor: create_explosion()
 *
 * -> This constructor creates an explosion when called
 * -> Assigns and sets up all the properties for the explosion
 * -> The passed in parameters of width, height, x, y, img_type and y_speed are all assigned to their respective properties in the explosion object
 */
function create_explosion(width, height, x, y, img_type, y_speed)
{
    this.location = canvas_surface;                                                 // Assign the location of the explosion to be inside the canvas element
    this.width = width;                                                             // Set the width of the explosion
    this.height = height;                                                           // Set the height of the explosion
    this.x_speed = 0;                                                               // Set the horizonatl speed of the explosion
    this.y_speed = y_speed;                                                         // Set the vertical speed of the explosion
    this.x_pos = x;                                                                 // Set the x-coordinate of the projectile
    this.y_pos = y;                                                                 // Set the y-coordinate of the projectile
    this.distance_tracker = 0;                                                      // Track the distance the projectile travels

    /* This function updates the position of the explosion */
    this.update_speed = function()
    {
        this.x_pos += this.x_speed;
        this.y_pos += this.y_speed;
    }

    /* This function draws the explosion onto the canvas surface */
    this.update_movement = function()
    {
        ctx = canvas_surface.context;
        ctx.drawImage(img_type, this.x_pos, this.y_pos);
    }
}

/**
 * Constructor: create_wave()
 *
 * -> This constructor creates an enemy wave when called
 * -> Assigns and sets up all the properties for the enemy wave
 * -> The passed in parameters of enemy_type and num_enemy are all assigned to their respective properties in the enemy wave object
 */
function create_wave(enemy_type, num_enemy)
{
    this.enemy_type = enemy_type;                                                   // Set the enemy type to be spawned in the wave
    this.num_enemy = num_enemy;                                                     // Set the number of enemies to be spawned in the wave
}

/**
 * Constructor: create_sound()
 *
 * -> This constructor creates a sound object when called
 * -> Allows sound file to played
 */
function create_sound(src) 
{
    this.sound = document.createElement("audio");                                   // Create audio element
    this.sound.src = src;                                                           // Set source for the object
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    /* This function plays the sound file when called */
    this.play = function() 
    {
        this.sound.play();
    }
}

/***////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////***/
/******************************************************************************************** Canvas functions ****************************************************************************************************************************************************************************************/

/**
 * Function: page_loadup()
 *
 * -> This function shows the start menu of the game
 * -> Hides the gameover and you win screens
 * -> Calls queue_enemy_waves() to queue waves to be spawned
 */
function page_loadup()
{
    // Reference the start menu and display it
    popup_title = document.getElementById("popup-startup");
    popup_title.style.display = "block"; 

    // Reference the gameover screen and hide it
    popup_gameover = document.getElementById("popup-gameover");
    popup_gameover.style.display = "none";

    // Reference the you win screen and hide it
    popup_you_win = document.getElementById("popup-you-win");
    popup_you_win.style.display = "none";

    // Reference the developer's signature and hide it
    popup_dev_name = document.getElementById("popup-developer-name");
    popup_dev_name.style.display = "none";

    // Queue waves to be spawned
    queue_enemy_waves();

    // Dequeue from the queue to spawn the first wave
    current_wave = enemy_spawning_queue.dequeue();
}

/**
 * Function: onload_setup()
 *
 * -> This function calls and initializes all the components in the game before the game starts
 */
function onload_setup() 
{
    // Play sound
    let menu_sound = new create_sound("click.wav");
    menu_sound.play();

    // Get rid of block
    popup_title.style.display = "none";

    // Enable block
    popup_dev_name.style.display = "block";

    // Set the backgrounds height and width
    img_width = img_background.width;
    img_height = img_background.height;

    // Initialize and setup the canvas surface
    canvas_surface.initialize_game();

    // Create a player
    my_player = new create_player(50, 45, 228, 770);

    // Keep track of the player
    players_list.push(my_player);

    // Check to see how many players are in the game
    console.log(players_list);

    // Create a shield
    player_shield = new create_shield(76, 20, my_player.x_pos - 12.5, my_player.y_pos - 20);

    // Keep track of the player's shield
    shield_list.push(player_shield);

    // Check to see how shields are in the game
    console.log(shield_list);

    // Spawn first wave
    setTimeout(function () {
        activate_enemy_type(current_wave.enemy_type);
    }, 3000);
}

/**
 * Function: update_canvas()
 *
 * -> This function updates all the movement of every object in the canvas
 * -> Allows enemies to spawn
 * -> Updates and draws the moving background of the canvas
 * -> Resets the canvas during every interval to allow animation
 */
function update_canvas() 
{
    // Clear the canvas for each animation
    canvas_surface.reset_canvas();

    // Allow enemy spawning
    generate_enemy();

    // Check if next wave of enemies can be spawned
    to_next_wave();

    // Draw background
    draw_background();

    // Iterate to update all players
    for (let play_i = 0; play_i < players_list.length; play_i++) 
    {
        // Allow player to move
        player_movement(play_i);

        // Allow player to shoot
        player_shoot(play_i);

        // Allow player to shield
        player_shielding(play_i);

        // Check player collision with enemy
        if (!player_collision(play_i)) 
        {
            // Redraw the player
            players_list[play_i].update_movement();
        }

        // Update the player's health
        players_list[play_i].health_bar();

        // Update the player's weapon systems
        players_list[play_i].weapons_online();

        // Update the player's speed
        players_list[play_i].update_speed();
    }

    // Iterate to update all enemies
    for (let en_i = 0; en_i < enemies_list.length; en_i++) 
    {
        // Allow enemy to move
        enemy_movement(en_i);

        // Redraw the enemy
        enemies_list[en_i].update_movement();

        // Update the player's health
        enemies_list[en_i].health_bar();

        // Update the enemy's speed
        enemies_list[en_i].update_speed();
    }

    // Iterate to update all enemy projectiles
    for (let en_proj_i = 0; en_proj_i < enemy_projectiles_list.length; en_proj_i++)
    {
        // Set projectile speed
        enemy_projectiles_list[en_proj_i].y_speed = 15;

        // Update the projectile's speed
        enemy_projectiles_list[en_proj_i].update_speed();
        
        // Check if projectile hits shield
        hit_shield(en_proj_i);

        // Check if projectile hits player
        hit_player(en_proj_i);

        // If the projectile isn't out of bounds, redraw the projectile
        if (!enemy_projectile_collision(en_proj_i))
            enemy_projectiles_list[en_proj_i].update_movement();
    }

    // Iterate to update all player projectiles
    for (let proj_i = 0; proj_i < projectiles_list.length; proj_i++)
    {
        // Set projectile speed
        projectiles_list[proj_i].y_speed = -15;

        // Update the projectile's speed
        projectiles_list[proj_i].update_speed();

        // Check if projectile hits an enemy
        hit_enemy(proj_i);
        
        // If the projectile isn't' out of bounds, redraw the projectile
        if (!projectile_collision(proj_i))
            projectiles_list[proj_i].update_movement();
    }

    // Iterate to update all explosion
    for (let ex_i = 0; ex_i < explosion_list.length; ex_i++)
    {
        // Update the explosion's speed
        explosion_list[ex_i].update_speed();

        // Track distance travelled by explosion
        explosion_list[ex_i].distance_tracker++;

        // If the explosion isn't out of bounds, redraw the explosion
        if (!explosion_bounds(ex_i))
            explosion_list[ex_i].update_movement();
    }
}

/**
 * Function: draw_background()
 *
 * -> This function draws the moving background of the canvas
 */
function draw_background()
{
    // Set context
    ctx = canvas_surface.context;

    // Check if the height of the background is smaller or equal to the canvas size then
    if (img_height <= background_height)
    {
        // Reset and start moving from the beginning
        if (background_y > background_height)
        {
            background_y += -img_height;
        }
        // Draw the background outside of the canvas
        if (background_y > 0)
        {
            ctx.drawImage(img_background, background_x, -img_height + background_y, img_width, img_height);
        }
        // Draw another background outside of the canvas
        if (background_y - img_height > 0)
        {
            ctx.drawImage(img_background, background_x, -img_height * 2 + background_y, img_width, img_height);
        }
    }
    // Check if the height of the background is bigger than the canvas size then 
    else
    {   
        // Reset and start moving from the beginning
        if (background_y > background_height)
        {
            background_y = background_height - img_height;
        }
        // Draw additional background
        if (background_y > (background_height - img_height))
        {
            ctx.drawImage(img_background, background_x, background_y - img_height + 1, img_width, img_height);
        }
    }

    // Draw the current background
    ctx.drawImage(img_background, background_x, background_y, img_width, img_height);
    
    // Track the distance moved by the background vertically
    background_y += distance_y;
}

/**
 * Function: generate_enemy()
 *
 * -> This function sets up and creates enemies at a given interval
 */
function generate_enemy() 
{
    // Check if all the enemies in the wave have been spawned yet
    if (num_spawned < current_wave.num_enemy)
    {
        // Check if type 1 enemies can be created
        if (type_1_can_gen)
        {
            // Set flag
            type_1_can_gen = false;

            // Type 1 generation
            my_enemy = new create_enemy(45, 58, 227.5, -58, 1, -2, 0, img_type_1, true, 2000, 200, 150, false);
            enemies_list.push(my_enemy);
            
            // Increment number of enemies spawned
            num_spawned++;

            /* Output number of enemies in array */
            console.log(enemies_list);

            // Set timeer to allow the next enemy to be spawned after a given interval
            setTimeout(function() 
            {
                // Set flag
                type_1_can_gen = true;
            }, type_1_gen_interval);
        }

        // Check if type 2 enemies can be created
        if (type_2_can_gen)
        {
            // Set flag
            type_2_can_gen = false;

            // Type 2 generation
            my_enemy = new create_enemy(45, 59, 500, -58, 2, -2, 0, img_type_2, false, 2000, 200, 200, false);
            enemies_list.push(my_enemy);

            // Increment number of enemies spawned
            num_spawned++;
            
            /* Output number of enemies in array */
            console.log(enemies_list);

            // Set timer to allow the next enemy to be spawned after a given interval
            setTimeout(function() 
            {
                // Set flag
                type_2_can_gen = true;
            }, type_2_gen_interval);
        }

        // Check if type 3 enemies can be created
        if (type_3_can_gen)
        {
            // Set flag
            type_3_can_gen = false;

            // Type 3 generation
            my_enemy = new create_enemy(50, 45, 450, -45, 3, 0, 3, img_type_3, true, 2000, 200, 100, false);
            enemies_list.push(my_enemy);

            // Increment number of enemies spawned
            num_spawned++;

            /* Output number of enemies in array */
            console.log(enemies_list);

            // Set timeer to allow the next enemy to be spawned after a given interval
            setTimeout(function() 
            {
                // Set flag
                type_3_can_gen = true;
            }, type_3_gen_interval);
        }

        // Check if type 4 enemies can be created
        if (type_4_can_gen)
        {
            // Set flag
            type_4_can_gen = false;

            // Type 4 generation
            my_enemy = new create_enemy(64, 32, 0, -58, 4, 0, 3, img_type_4, true, 1000, 150, 250, false);
            enemies_list.push(my_enemy);

            // Increment number of enemies spawned
            num_spawned++;
            
            /* Output number of enemies in array */
            console.log(enemies_list);

            // Set timeer to allow the next enemy to be spawned after a given interval
            setTimeout(function() 
            {
                // Set flag
                type_4_can_gen = true;
            }, type_4_gen_interval);
        }

        // Check if type 5 enemies can be created
        if (type_5_can_gen)
        {
            // Set flag
            type_5_can_gen = false;

            // Type 5 generation
            my_enemy = new create_enemy(64, 32, 440, -58, 5, 0, 3, img_type_5, true, 500, 100, 250, false);
            enemies_list.push(my_enemy);

            // Increment number of enemies spawned
            num_spawned++;
            
            /* Output number of enemies in array */
            console.log(enemies_list);

            // Set timeer to allow the next enemy to be spawned after a given interval
            setTimeout(function() 
            {
                // Set flag
                type_5_can_gen = true;
            }, type_5_gen_interval);
        }

        // Check if type boss enemies can be created
        if (type_boss_can_gen)
        {
            // Set flag
            type_boss_can_gen = false;

            // Type boss generation
            my_enemy = new create_enemy(95, 65, 202.5, -80, 6, 0, 2, img_boss, true, 1500, 100, 8000, true);
            enemies_list.push(my_enemy);

            // Increment number of enemies spawned
            num_spawned++;

            /* Output number of enemies in array */
            console.log(enemies_list);

            // Set timeer to allow the next enemy to be spawned after a given interval
            setTimeout(function()
            {
                // Set flag
                type_boss_can_gen = false;
            }, type_boss_gen_interval)
        }
    }
}

/**
 * Function: queue_enemy_waves()
 *
 * -> This function queues enemy waves into the queue
 */
function queue_enemy_waves()
{
    /* Queue enemy waves */
    enemy_spawning_queue.enqueue(new create_wave(3, 3));
    enemy_spawning_queue.enqueue(new create_wave(3, 6));
    enemy_spawning_queue.enqueue(new create_wave(2, 6));
    enemy_spawning_queue.enqueue(new create_wave(4, 4));
    enemy_spawning_queue.enqueue(new create_wave(2, 6));
    enemy_spawning_queue.enqueue(new create_wave(5, 4));
    enemy_spawning_queue.enqueue(new create_wave(5, 4));
    enemy_spawning_queue.enqueue(new create_wave(1, 8));
    enemy_spawning_queue.enqueue(new create_wave(2, 8));
    enemy_spawning_queue.enqueue(new create_wave(3, 8));
    enemy_spawning_queue.enqueue(new create_wave(1, 8));
    enemy_spawning_queue.enqueue(new create_wave(6, 1));
}

/**
 * Function: to_next_wave()
 *
 * -> This function checks if the next wave of enemies can be spawned
 * -> Sets up the transition to the next enemy wave
 * -> Transitions to you win screen if the queue is empty
 */
function to_next_wave() 
{
    // Check if all enemies in the current wave have been spawned, all enemies have been killed in the current wave and that the flag is false
    if (num_spawned == current_wave.num_enemy && enemies_list.length == 0 && !flag_spawn_wave)
    {
        // Deacticate the flag for spawning the current type of enemy
        deactivate_enemy_type(current_wave.enemy_type);

        // Set flag
        flag_spawn_wave = true;

        // Set timer to allow wave to start after a certain interval
        setTimeout(function() 
        {
            // Reset counter
            num_spawned = 0;

            // Check if queue isn't empty
            if (enemy_spawning_queue.len() > 0)
            {
                // Get the next enemy wave
                current_wave = enemy_spawning_queue.dequeue();

                // Activate the flag for spawning the current type of enemy
                activate_enemy_type(current_wave.enemy_type);
                
                // Check if current wave is the boss wave
                if (current_wave.enemy_type == 6)
                {
                    // Play sound
                    let regen_sound = new create_sound("win2.wav");
                    regen_sound.play();

                    // Reset the player's health to max
                    players_list[0].health = 200;
                    players_list[0].shield = true;

                    // Check if the player doesn't have a shield
                    if (shield_list.length == 0)
                    {
                        // Create a shield
                        player_shield = new create_shield(76, 20, my_player.x_pos - 12.5, my_player.y_pos - 20);

                        // Keep track of the player's shield
                        shield_list.push(player_shield);
                    }
                    // Reset the health of the shield to max
                    else
                    {
                        shield_list[0].health == 100;
                    }
                }

                flag_spawn_wave = false;
            }
            // Check if the queue is empty
            else
            {
                // Set timer to allow the you win screen to appear after a given interval
                setTimeout(function()
                {
                    // Stop the canvas from updating
                    canvas_surface.stop_canvas();

                    // Reference the canvas surface
                    let retrieve_element = document.getElementById("canvas-container");

                    // Remove the canvas element from the HTML
                    retrieve_element.parentNode.removeChild(retrieve_element);

                    // Display the you win screen
                    popup_you_win.style.display = "block";

                    // Play sound
                    let victory_sound = new create_sound("win1.wav");
                    victory_sound.play();

                    // Hide the developer's signature
                    popup_dev_name.style.display = "none";
                }, 1200);
            }
        }, 3000);
    }
}

/**
 * Function: activate_enemy_type()
 *
 * -> This function sets the flag of the enemy to be spawned
 * -> The passed in parameters of type_in is used to set its corresponding flag
 */
function activate_enemy_type(type_in)
{
    /* Set flag accordingly */
    switch (type_in)
    {
        case 1:
            type_1_can_gen = true;
            break;
        case 2:
            type_2_can_gen = true;
            break;
        case 3:
            type_3_can_gen = true;
            break;
        case 4:
            type_4_can_gen = true;
            break;
        case 5:
            type_5_can_gen = true;
            break;
        case 6:
            type_boss_can_gen = true;
            break;
    }
}

/**
 * Function: deactivate_enemy_type()
 *
 * -> This function sets the flag of the enemy to be spawned
 * -> The passed in parameters of type_in is used to set its corresponding flag
 */
function deactivate_enemy_type(type_in)
{
    /* Set flag accordingly */
    switch (type_in)
    {
        case 1:
            type_1_can_gen = false;
            break;
        case 2:
            type_2_can_gen = false;
            break;
        case 3:
            type_3_can_gen = false;
            break;
        case 4:
            type_4_can_gen = false;
            break;
        case 5:
            type_5_can_gen = false;
            break;
        case 6:
            type_boss_can_gen = false;
            break;
    }
}

/***////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////***/
/******************************************************************************************** Player functions ****************************************************************************************************************************************************************************************/

/**
 * Function: player_movement()
 *
 * -> This function sets the speed of the player when the arrow keys are pressed
 * -> The passed in parameters of play_i references the player object in the player array at the index of play_i
 */
function player_movement(play_i)
{
    // Add friction to the horizonal movement of the player
    players_list[play_i].x_speed *= players_list[play_i].friction;

    // Reset the vertical movement of the player
    players_list[play_i].y_speed = 0;

    /* On keypress, change the speed of the player */
    if (canvas_surface.keys && canvas_surface.keys[37])
    {
        // Move left
        players_list[play_i].x_speed = -10;
    }
    if (canvas_surface.keys && canvas_surface.keys[39])
    {
        // Move right
        players_list[play_i].x_speed = 10;
    }
    if (canvas_surface.keys && canvas_surface.keys[38])
    {
        // Move up
        players_list[play_i].y_speed = -10;
    }
    if (canvas_surface.keys && canvas_surface.keys[40])
    {
        // Move down
        players_list[play_i].y_speed = 10;
    }
}

/**
 * Function: player_shoot()
 *
 * -> This function allows the player to shoot, rapid fire, use special and missiles
 * -> The passed in parameters of play_i references the player object in the player array at the index of play_i
 */
function player_shoot(play_i)
{
    // Set context
    ctx = canvas_surface.context;

    // Check if five waves of the special has been shot
    if (special_counter >= 5)
    {
        // Disable shooting multiple specials
        clearInterval(special_fire_interval);
    }

    // Check if the player can shoot
    if (players_list[play_i].can_fire) 
    {
        // Check if space is pressed
        if (canvas_surface.keys && canvas_surface.keys[32]) 
        {
            // Set flag
            players_list[play_i].can_fire = false;

            // Play sound
            let can_fire_sound = new create_sound("lasergun1.wav");
            can_fire_sound.play();

            // Create projectile
            player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_lazer, 0, 20);
            projectiles_list.push(player_projectile);

            /* Output number of projectiles in array */
            console.log(projectiles_list);

            // Set timer to allow the next projectile to be shot after a given interval
            setTimeout(function() 
            {
                // Set flag
                players_list[play_i].can_fire = true;
            }, shooting_interval);
        }
    }

    // Check if the player can rapid fire
    if (players_list[play_i].rapid_fire) 
    {
        // Check if space is pressed
        if (canvas_surface.keys && canvas_surface.keys[32]) 
        {
            // Set flag
            players_list[play_i].rapid_fire = false;

            // Create projectile
            player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_lazer, 0, 15);
            projectiles_list.push(player_projectile);

            // Play sound
            can_fire_sound.play();

            // Create projectile
            player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_lazer, -2.5, 15);
            projectiles_list.push(player_projectile);

            // Play sound
            can_fire_sound.play();

            // Create projectile
            player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_lazer, 2.5, 15);
            projectiles_list.push(player_projectile);

            // Play sound
            can_fire_sound.play();

            /* Output number of projectiles in array */
            console.log(projectiles_list);

            // Set timer to allow the next projectile to be shot after a given interval
            setTimeout(function() 
            {
                // Set flag
                players_list[play_i].rapid_fire = true;
            }, shooting_interval);
        }
    }

    // Check if the player can special fire
    if (players_list[play_i].special_fire)
    {
        // Check if x is pressed
        if (canvas_surface.keys && canvas_surface.keys[88])
        {
            // Set flag 
            players_list[play_i].special_fire = false;

            // Play sound
            let multi_fire_sound = new create_sound("cannon.wav");
            multi_fire_sound.play();

            // Set interval of special fire
            special_fire_interval = setInterval(function() 
            {
                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, 1, 40);
                projectiles_list.push(player_projectile);

                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, -1, 40);
                projectiles_list.push(player_projectile);

                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, 2, 40);
                projectiles_list.push(player_projectile);

                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, -2, 40);
                projectiles_list.push(player_projectile);

                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, 3, 40);
                projectiles_list.push(player_projectile);

                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, -3, 40);
                projectiles_list.push(player_projectile);

                // Create projectile
                player_projectile = new create_projectile(8, 32, players_list[play_i].x_pos + 21, players_list[play_i].y_pos - 10, img_special_lazer, 0, 40);
                projectiles_list.push(player_projectile);

                // Increment counter
                special_counter++;

            }, 100);

            // Set timer to allow the next projectile to be shot after a given interval
            setTimeout(function() 
            {
                // Set flag
                players_list[play_i].special_fire = true;

                // Reset counter
                special_counter = 0;
            }, 15000);
        }
    }

    // Check if the player can shoot missiles
    if (players_list[play_i].missile)
    {
        // Check if z is pressed
        if (canvas_surface.keys && canvas_surface.keys[90])
        {
            // Set flag
            players_list[play_i].missile = false;

            // Play sound
            let missile_sound = new create_sound("boomshot.wav");
            missile_sound.play();

            // Create projectile
            player_projectile = new create_projectile(32, 32, players_list[play_i].x_pos - 10, players_list[play_i].y_pos - 10, img_missile, 0, 35);
            projectiles_list.push(player_projectile);

            // Create projectile
            player_projectile = new create_projectile(32, 32, players_list[play_i].x_pos + 30, players_list[play_i].y_pos - 10, img_missile, 0, 35);
            projectiles_list.push(player_projectile);

            /* Output number of projectiles in array */
            console.log(projectiles_list);

            // Set timer to allow the next projectile to be shot after a given interval
            setTimeout(function() 
            {
                // Set flag
                players_list[play_i].missile = true;
            }, 5000);
        }
    }
}

/**
 * Function: player_shield()
 *
 * -> This function allows the player to shield
 * -> The passed in parameters of play_i references the player object in the player array at the index of play_i
 */
function player_shielding(play_i)
{
    // Check if the player can shield
    if (players_list[play_i].shield) 
    {
        // Check if the c is pressed
        if (canvas_surface.keys && canvas_surface.keys[67]) 
        {
            // Make the shield visible
            shield_list[0].visible = true;

            // Update the shield's speed
            shield_list[0].update_speed();

            // Redraw the shield
            shield_list[0].update_movement();
        }
        else
        {
            // Make the shield not visible
            shield_list[0].visible = false;
        }
    }
}

/**
 * Function: player_death()
 *
 * -> This function checks if the player dies
 * -> Transitions to the game over screen if the player is dead
 */
function player_death() 
{
    // Set timer to allow the game over screen to appear after a given interval
    setTimeout(function() 
    {
        // Stop the canvas from updating
        canvas_surface.stop_canvas();

        // Reference the canvas surface
        let retrieve_element = document.getElementById("canvas-container");

        // Remove the canvas element from the HTML
        retrieve_element.parentNode.removeChild(retrieve_element);

        // Display the game over screen
        popup_gameover.style.display = "block";
        
        // Play sound
        let gameover_sound = new create_sound("computer2.wav");
        gameover_sound.play();

        // Hide the developer's signature
        popup_dev_name.style.display = "none";
    }, 1200);
}

/********************************************************************************************** Enemy functions ***************************************************************************************************************************************************************************************/

/**
 * Function: enemy_movement()
 *
 * -> This function sets the speed and direction of the referenced enemy type
 * -> The passed in parameters of en_i references the enemy object in the enemy array at the index of en_i
 */
function enemy_movement(en_i)
{
    /* Set enemy movement accordingly */
    switch (enemies_list[en_i].type)
    {
        // Set movement for type 1 enemy
        case 1:
            // Update horizontal and vertical speeds
            enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
            enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;

            // Check if the enemy's position is less than 50 pixels from top 
            if (enemies_list[en_i].y_pos < 50) 
            {
                // Set speed
                enemies_list[en_i].current_speed_y = 1;
            }

            // Check if the enemy's position is 50 pixels from top
            if (enemies_list[en_i].y_pos == 50)
            {
                // Set and update speed
                enemies_list[en_i].y_pos += 2;
                enemies_list[en_i].current_speed_y = 0;
            }

            // Check if the enemy's position is greater than 50 pixels from top
            if (enemies_list[en_i].y_pos > 50)
            {
                // Enable shooting
                enemy_shoot(en_i);
                
                // Check if enemy's position is between both left and right bounds of the canvas
                if (enemies_list[en_i].x_pos > 0 && enemies_list[en_i].x_pos < 455) 
                {
                    // Set speed
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                }

                // Check if the enemy hits the left bound of canvas
                if (enemies_list[en_i].x_pos <= 0) 
                {
                    // Set and update horizontal and vertical speeds
                    enemies_list[en_i].current_speed_x *= -1;
                    enemies_list[en_i].current_speed_y = 1;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }

                // Check if the enemy hits the right bound of canvas
                if (enemies_list[en_i].x_pos >= 455) 
                {
                    // Set and update horizontal and vertical speeds
                    enemies_list[en_i].current_speed_x *= -1;
                    enemies_list[en_i].current_speed_y = 1;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }

                // Check if the enemy's position is greater or equal to 70 pixels from the top
                if (enemies_list[en_i].y_pos >= 70)
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_y *= -1;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }

                // Check if the enemy's position is less or equal to 51 pixels from top
                if (enemies_list[en_i].y_pos <= 51)
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_y *= -1;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }
            }
            break;

        // Set movement for type 2 enemy
        case 2:
            // Update horizontal and vertical speeds
            enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
            enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;

            // Check if the enemy's position is less than 50 pixels from top 
            if (enemies_list[en_i].y_pos < 50) 
            {
                // Set speed
                enemies_list[en_i].current_speed_y = 1;
            }

            // Check if the enemy's position is 50 pixels from top 
            if (enemies_list[en_i].y_pos == 50)
            {
                // Set and update speed
                enemies_list[en_i].y_pos += 2;
                enemies_list[en_i].current_speed_y = 0;
            }

            // Check if the enemy's position is greater than 50 pixels from top 
            if (enemies_list[en_i].y_pos > 50) 
            {
                // Enable shooting
                enemy_shoot(en_i);

                // Check if enemy's position is between both left and right bounds of the canvas
                if (enemies_list[en_i].x_pos > 0 && enemies_list[en_i].x_pos < 455) 
                {
                    // Set speed
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                }

                // Check if the enemy hits the left bound of canvas
                if (enemies_list[en_i].x_pos <= 0) 
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = 2;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }

                // Check if the enemy hits the right bound of canvas
                if (enemies_list[en_i].x_pos >= 455) 
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = -2;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }
            }
            break;
        
        // Set movement for type 3 enemy
        case 3:
            // Update horizontal and vertical speeds
            enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
            enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;

            // Check if the enemy is between 50 and 54 pixels from the top
            if (enemies_list[en_i].y_pos >= 50 && enemies_list[en_i].y_pos < 55)
            {
                // Set and update speed
                enemies_list[en_i].y_pos += 5;
                enemies_list[en_i].current_speed_x = -2;
                enemies_list[en_i].current_speed_y = 0;
            }

            // Check if the enemy is greater or equal to 55 pixels from the top
            if (enemies_list[en_i].y_pos >= 55)
            {
                // Enable shooting
                enemy_shoot(en_i);

                // Check if the enemy hits the left bound of canvas
                if (enemies_list[en_i].x_pos <= 0) 
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = 2;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                }

                // Check if the enemy hits the right bound of canvas
                if (enemies_list[en_i].x_pos >= 455) 
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = -2;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                }
            }
            break;

        // Set movement for type 4 enemy
        case 4:
            // Update horizontal and vertical speeds
            enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
            enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;

            // Check if the enemy is between 50 and 54 pixels from the top
            if (enemies_list[en_i].y_pos >= 50 && enemies_list[en_i].y_pos < 55)
            {
                // Set and update speed
                enemies_list[en_i].y_pos += 5;
                enemies_list[en_i].current_speed_x = 2;
                enemies_list[en_i].current_speed_y = 0;
            }

            // Check if there are 4 or more enemies
            if (enemies_list.length >= 4)
            {

                // Check if the first enemy's horizontal coordinate is 400 pixels from left
                if (enemies_list[0].x_pos >= 400)
                {
                    // Set speed
                    enemies_list[en_i].current_speed_x = 0;
                }
            }

            // Enable shooting
            enemy_shoot(en_i);

            // Check if tehre are less than 4 enemies 
            if (enemies_list.length < 4)
            {
                // Check if the enemy is greater or equal to 55 pixels from top
                if (enemies_list[en_i].y_pos >= 55) 
                {
                    // Check if the enemy hits the left bound of canvas
                    if (enemies_list[en_i].x_pos <= 0) 
                    {
                        // Set and update speed
                        enemies_list[en_i].current_speed_x = 2;
                        enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    }

                    // Check if the enemy hits the right bound of canvas
                    if (enemies_list[en_i].x_pos >= 455) 
                    {
                        // Set and update speed
                        enemies_list[en_i].current_speed_x = -2;
                        enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    }
                }
            }
            break;

        // Set movement for type 5 enemy
        case 5:
            // Update horizontal and vertical speeds
            enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
            enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;

            // Check if the enemy is between 60 and 70 pixels from the top
            if (enemies_list[en_i].y_pos >= 60 && enemies_list[en_i].y_pos < 70)
            {
                // Set and update speed
                enemies_list[en_i].y_pos += 5;
                enemies_list[en_i].current_speed_x = -2;
                enemies_list[en_i].current_speed_y = 0;
            }

            // Check if there are 4 or more enemies            
            if (enemies_list.length >= 4)
            {
                // Check if the first enemy's horizontal coordinate is less or equal to 40 pixels from left
                if (enemies_list[0].x_pos <= 40)
                {
                    enemies_list[en_i].current_speed_x = 0;
                }
            }

            // Enable shooting
            enemy_shoot(en_i);

            // Check if tehre are less than 4 enemies 
            if (enemies_list.length < 4)
            {
                // Check if the enemy is greater or equal to 55 pixels from top
                if (enemies_list[en_i].y_pos >= 55) 
                {
                    // Check if the enemy hits the left bound of canvas
                    if (enemies_list[en_i].x_pos <= 0) 
                    {
                        // Set and update speed
                        enemies_list[en_i].current_speed_x = 2;
                        enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    }

                    // Check if the enemy hits the right bound of canvas
                    if (enemies_list[en_i].x_pos >= 455) 
                    {
                        // Set and update speed
                        enemies_list[en_i].current_speed_x = -2;
                        enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    }
                }
            }
            break;
            
        // Set movement for type boss enemy
        case 6:
            // Update horizontal and vertical speeds
            enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
            enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;

            // Check if boss is between 60 and 69 pixels from the top, boss's health is greater or equal to 6500 and flag is false
            if (enemies_list[en_i].y_pos >= 60 && enemies_list[en_i].y_pos < 70 && enemies_list[en_i].health >= 6500 && !health_check_1)
            {
                // Set and update speed
                enemies_list[en_i].y_pos += 5;
                enemies_list[en_i].current_speed_y = 0;
            }

            // Enable shooting
            enemy_shoot(en_i);

            // Check if boss's health is between 6000 and 6499 and flag is false
            if (enemies_list[en_i].health < 6500 && enemies_list[en_i].health >= 6000 && !health_check_1)
            {
                // Set and update speed
                enemies_list[en_i].current_speed_x = -1;
                enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;

                // Set flag
                health_check_1 = true;
            }

            // Check flag
            if (health_check_1)
            {
                // Check if boss's position is between both left and right bounds of the canvas
                if (enemies_list[en_i].x_pos > 0 && enemies_list[en_i].x_pos < 405)
                {
                    // Set and update speed
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                }

                // Check if the boss hits the left bound of canvas
                if (enemies_list[en_i].x_pos <= 0)
                {   
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = 1;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }

                // Check if the enemy hits the right bound of canvas
                if (enemies_list[en_i].x_pos >= 405)
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = -1;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                    enemies_list[en_i].y_speed = enemies_list[en_i].current_speed_y;
                }

                // Set flag
                health_check_2 = true;
            }

            // Check if flag is true and if the boss's health is less than 4000
            if (health_check_2 && enemies_list[en_i].health < 4000)
            {
                // Check if the boss's position is less or equal to 202 pixels from left
                if (enemies_list[en_i].x_pos <= 202)
                {
                    // Set and update speed
                    enemies_list[en_i].current_speed_x = 0;
                    enemies_list[en_i].x_speed = enemies_list[en_i].current_speed_x;
                }
            }
    }
}

/**
 * Function: enemy_shoot()
 *
 * -> This function allows the enemy to shoot and multifire
 * -> The passed in parameters of en_i references the enemy object in the enemy array at the index of en_i
 */
function enemy_shoot(en_i)
{
    if (enemies_list[en_i].can_fire && !enemies_list[en_i].boss)
    {
        // Set flag
        enemies_list[en_i].can_fire = false;

        // Set timer to allow the next projectile to be shot after a given interval
        setTimeout(function()
        {
            // Create projectile
            enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 5, enemies_list[en_i].y_pos + 10, img_enemy_lazer, 0, 10);
            enemy_projectiles_list.push(enemy_projectile);

            // Play sound
            let enemy_shoot_sound = new create_sound("gun5.wav");
            enemy_shoot_sound.play();

            if (enemies_list[en_i].rapid_fire)
            {
                // Set timer to allow the next projectile to be shot after a given interval
                setTimeout(function() 
                {
                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 5, enemies_list[en_i].y_pos + 10, img_enemy_lazer, 0, 10);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Play sound
                    let enemy_shoot_sound = new create_sound("gun5.wav");
                    enemy_shoot_sound.play();

                    // Set timer to allow the next projectile to be shot after a given interval
                    setTimeout(function() 
                    {
                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 5, enemies_list[en_i].y_pos + 10, img_enemy_lazer, 0, 10);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Play sound
                        let enemy_shoot_sound = new create_sound("gun5.wav");
                        enemy_shoot_sound.play();

                    }, enemies_list[en_i].multi_rate);
                }, enemies_list[en_i].multi_rate);
            }

            // Set flag
            enemies_list[en_i].can_fire = true;
        }, enemies_list[en_i].fire_rate);
    }

    // Check if the referenced enemy is a boss and can shoot
    if (enemies_list[en_i].can_fire && enemies_list[en_i].boss)
    {
        // Set flag
        enemies_list[en_i].can_fire = false;

        // Check if the boss has shot 18 shots of rapid fire
        if (shot_counter >= 18 && enemies_list[en_i].rapid_fire)
        {
            // Set flag
            enemies_list[en_i].rapid_fire = false;

            // Reset counter
            shot_counter = 0;

            // Set flag
            enemies_list[en_i].alternate_fire = true;
        }

        // Check if the boss has shot 18 shots of alternate fire
        if (shot_counter >= 20 && enemies_list[en_i].alternate_fire)
        {
            // Set flag
            enemies_list[en_i].alternate_fire = false;

            // Reset counter
            shot_counter = 0;
            
            // Set flag
            enemies_list[en_i].rapid_fire = true;
        }

        // Set timer to allow the next projectile to be shot after a given interval
        setTimeout(function()
        {
            // Check if the referenced boss can rapid fire
            if (enemies_list[en_i].rapid_fire)
            {
                // Create projectile
                enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_boss_lazer, 0, 10);
                enemy_projectiles_list.push(enemy_projectile);

                // Increment counter
                shot_counter++;
            }

            // Play sound
            let enemy_shoot_sound = new create_sound("gun5.wav");
            enemy_shoot_sound.play();

            // Check if the referenced boss can rapid fire
            if (enemies_list[en_i].rapid_fire)
            {
                // Set timer to allow the next projectile to be shot after a given interval
                setTimeout(function() 
                {
                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_boss_lazer, 2, 10);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_boss_lazer, -2, 10);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Play sound
                    let enemy_shoot_sound = new create_sound("gun5.wav");
                    enemy_shoot_sound.play();

                    // Set timer to allow the next projectile to be shot after a given interval
                    setTimeout(function() 
                    {
                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_boss_lazer, 1, 10);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_boss_lazer, -1, 10);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_boss_lazer, 0, 10);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Play sound
                        let enemy_shoot_sound = new create_sound("gun5.wav");
                        enemy_shoot_sound.play();

                    }, enemies_list[en_i].multi_rate);
                }, enemies_list[en_i].multi_rate);
            }

            // Check if the referenced boss can alternate fire
            if (enemies_list[en_i].alternate_fire)
            {
                // Set timer to allow the next projectile to be shot after a given interval
                setTimeout(function() 
                {
                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, 0, 20);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, 1, 20);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, -1, 20);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, 2, 20);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Create projectile
                    enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, -2, 20);
                    enemy_projectiles_list.push(enemy_projectile);

                    // Increment counter
                    shot_counter++;

                    // Play sound
                    let enemy_alternate_fire_sound = new create_sound("cannon.wav");
                    enemy_alternate_fire_sound.play();

                    // Set timer to allow the next projectile to be shot after a given interval
                    setTimeout(function() 
                    {
                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, 1, 20);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, -1, 20);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, 0, 20);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, 2, 20);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Create projectile
                        enemy_projectile = new create_projectile(8, 32, enemies_list[en_i].x_pos + (enemies_list[en_i].width / 2) - 2.5, enemies_list[en_i].y_pos + 40, img_special_lazer, -2, 20);
                        enemy_projectiles_list.push(enemy_projectile);

                        // Increment counter
                        shot_counter++;

                        // Play sound
                        enemy_alternate_fire_sound.play();

                    }, enemies_list[en_i].multi_rate);
                }, enemies_list[en_i].multi_rate);
            }

            // Set flag
            enemies_list[en_i].can_fire = true;
        }, enemies_list[en_i].fire_rate);
    }
}

/******************************************************************************************** Collision functions **************************************************************************************************************************************************************************************/

/**
 * Function: player_check_bounds()
 *
 * -> This function checks if the player is out of bounds
 */
function player_check_bounds()
{   
    // Iterate to check all players in the array
    for (let i = 0; i < players_list.length; i++)
    {
        // Check if the player has reached the left of the canvas
        if (players_list[i].x_pos + 50 <= 0)
            players_list[i].x_pos = 480;                // Set the player's position to be at the right bound of the canvas

        // Check if the player has reached the right of the canvas
        if (players_list[i].x_pos >= 500)
            players_list[i].x_pos = 0;                  // Set the player's position to be at the left bound of the canvas

        // Check if the player has reached the top of the canvas
        if (players_list[i].y_pos + 10 == 0)
            players_list[i].y_pos = 0;                  // Restrict the player from moving psat the top of the canvas

        // Check if the player has reached the bottom of the canvas
        if (players_list[i].y_pos == 810)
            players_list[i].y_pos = 800;                // Restrict the player from moving past the bottom of the canvas
    }
}

/**
 * Function: player_collision()
 *
 * -> This function checks if the referenced player has collided into an enemy
 * -> The passed in parameters of play_i references the player object in the player array at the index of play_i
 */
function player_collision(play_i)
{
    // Iterate to check through every enemy
    for (let en_i = 0; en_i < enemies_list.length; en_i++)
    {
        // Check if the player's coordinates are overlapping any of the referenced enemy's coordinates
        if ((players_list[play_i].y_pos <= enemies_list[en_i].y_pos) && (players_list[play_i].x_pos >= enemies_list[en_i].x_pos && players_list[play_i].x_pos <= enemies_list[en_i].x_pos + enemies_list[en_i].width))
        {
            // Remove the player from the array
            players_list.splice(0, 1);

            // Decrement index
            play_i--;

            /* Output number of players in array */
            console.log(players_list);

            // Create explosion
            collision_explosion = new create_explosion(60, 63, enemies_list[en_i].x_pos, enemies_list[en_i].y_pos - 10, img_explosion, 1);
            explosion_list.push(collision_explosion);

            // Play sound
            let explosion_sound = new create_sound("explosion.wav");
            explosion_sound.play();

            /* Testing purposes only */
            console.log("created " + explosion_list);

            // Remove the referenced enemy from the array
            enemies_list.splice(en_i, 1);

            /* Output the number of enemies in the array */
            console.log(enemies_list);

            // Decrement index
            en_i--;

            // Call player_death() to show game over screen
            player_death();

            // Return value
            return true;
        }   
    }
    // Return value
    return false;
}

/**
 * Function: projectile_collision()
 *
 * -> This function checks if the referenced enemy projectile is out of bounds
 * -> The passed in parameters of en_i references the enemy object in the enemy array at the index of en_i
 */
function projectile_collision(proj_i)
{
    // Check if the projectile has reached the top of the canvas
    if (projectiles_list[proj_i].y_pos <= -10)
    {
        // Remove the projectile from the array
        projectiles_list.splice(proj_i, 1);

        // Decrement index
        proj_i--;

        /* Testing purposes only */
        console.log("projectile out");

        /* Output number of projectiles in array */
        console.log(projectiles_list);

        // Return value
        return true;
    }
    else 
    {
        // Return value
        return false;
    }
}

/**
 * Function: enemy_projectile_collision()
 *
 * -> This function checks if the referenced enemy projectile is out of bounds
 * -> The passed in parameters of en_proj_i references the enemy object in the enemy array at the index of en_proj_i
 */
function enemy_projectile_collision(en_proj_i)
{
    // Check if the projectile has reached the bottom of the canvas
    if (enemy_projectiles_list[en_proj_i].y_pos >= 850)
    {
        // Rempve the projectile from the array
        enemy_projectiles_list.splice(en_proj_i, 1);

        // Decrement index
        en_proj_i--;

        // Return value
        return true;
    }
    else
    {
        // Return value
        return false;
    }
}

/**
 * Function: hit_enemy()
 *
 * -> This function checks if the referenced projectile has hit an enemy
 * -> The passed in parameters of proj_i references the projectile object in the projectile array at the index of proj_i
 */
function hit_enemy(proj_i)
{
    // Iterate through all enemies
    for (let en_i = 0; en_i < enemies_list.length; en_i++)
    {
        // Check if the referenced projectile's coordinates are overlapping any of the referenced enemy's coordinates
        if (enemies_list[en_i].y_pos >= projectiles_list[proj_i].y_pos && (projectiles_list[proj_i].x_pos + 10 >= enemies_list[en_i].x_pos && projectiles_list[proj_i].x_pos <= enemies_list[en_i].x_pos + enemies_list[en_i].width))
        {
            // Decrement the enemy's health
            enemies_list[en_i].health -= projectiles_list[proj_i].damage;

            // Play sound
            let hit_sound = new create_sound("switch2.wav");
            hit_sound.play();

            /* Output the enemy's health */
            console.log(enemies_list[en_i] + "'s health is " + enemies_list[en_i].health);

            // Remove the projectile from the array
            projectiles_list.splice(proj_i, 1);

            // Decrement index
            proj_i--;

            // Check if the enemy's health is below or equal to 0
            if (enemies_list[en_i].health <= 0)
            {
                // Create explosion
                collision_explosion = new create_explosion(60, 63, enemies_list[en_i].x_pos, enemies_list[en_i].y_pos - 10, img_explosion, 1);
                explosion_list.push(collision_explosion);

                // Play sound
                let explosion_sound = new create_sound("explosion.wav");
                explosion_sound.play();

                /* Output the number of explosions in the array */
                console.log("created " + explosion_list);

                // Remove the enemy from the array
                enemies_list.splice(en_i, 1);

                // Decrement index
                en_i--;

                /* Output the number of enemies in the array */
                console.log(enemies_list);
            }
        }
    }
}

/**
 * Function: hit_shield()
 *
 * -> This function checks if the referenced projectile has hit the player's shield
 * -> The passed in parameters of en_proj_i references the projectile object in the enemy projectile array at the index of en_proj_i
 */
function hit_shield(en_proj_i)
{
    //  Iterate through all shields
    for (let shield_i = 0; shield_i < shield_list.length; shield_i++)
    {
        // Check if the referenced projectile's coordinates are overlapping any of the referenced shield's coordinates
        if (shield_list[shield_i].y_pos <= enemy_projectiles_list[en_proj_i].y_pos && (enemy_projectiles_list[en_proj_i].x_pos + 10 >= shield_list[shield_i].x_pos && enemy_projectiles_list[en_proj_i].x_pos <= shield_list[shield_i].x_pos + shield_list[shield_i].width) && shield_list[shield_i].visible)
        {
            // Decrement the shield's health
            shield_list[0].health -= enemy_projectiles_list[en_proj_i].damage;

            // Play sound
            let hit_sound = new create_sound("switch2.wav");
            hit_sound.play();

            /* Output the shield's health */
            console.log(shield_list[shield_i] + "'s health is " + shield_list[shield_i].health);

            // Remove the enemy projectile from the array
            enemy_projectiles_list.splice(en_proj_i, 1);

            // Decrement index
            en_proj_i--;

            // Check if the shield's health is below or equal to 0
            if (shield_list[shield_i].health <= 0) 
            {
                // Create explosion
                collision_explosion = new create_explosion(60, 63, shield_list[shield_i].x_pos, shield_list[shield_i].y_pos - 10, img_explosion, 1);
                explosion_list.push(collision_explosion);

                // Play sound
                let explosion_sound = new create_sound("explosion.wav");
                explosion_sound.play();

                /* Output the number of explosions in the array */
                console.log("created " + explosion_list);

                // Remove the shield from the array
                shield_list.splice(shield_i, 1);

                // Decrement index
                shield_i--;

                // Set flag
                players_list[0].shield = false;

                /* Output the number of shields in the array */
                console.log(shield_list);
            }
        }
    }
}

/**
 * Function: hit_player()
 *
 * -> This function checks if the referenced projectile has hit the player
 * -> The passed in parameters of en_proj_i references the projectile object in the enemy projectile array at the index of en_proj_i
 */
function hit_player(en_proj_i)
{
    // Iterate through all players
    for (let play_i = 0; play_i < players_list.length; play_i++)
    {
        // Check if the referenced projectile's coordinates are overlapping any of the referenced player's coordinates
        if (players_list[play_i].y_pos <= enemy_projectiles_list[en_proj_i].y_pos && (enemy_projectiles_list[en_proj_i].x_pos + 10 >= players_list[play_i].x_pos && enemy_projectiles_list[en_proj_i].x_pos <= players_list[play_i].x_pos + players_list[play_i].width))
        {
            // Decrement the player's health
            players_list[play_i].health -= enemy_projectiles_list[en_proj_i].damage;

            // Play sound
            let hit_sound = new create_sound("switch2.wav");
            hit_sound.play();

            /* Output the player's health */
            console.log(players_list[play_i] + "'s health is " + players_list[play_i].health);

            // Remove the projectile from the array
            enemy_projectiles_list.splice(en_proj_i, 1);

            // Decrement index
            en_proj_i--;

            // Check if the player's health is below or equal to 0
            if (players_list[play_i].health <= 0)
            {
                // Create explosion
                collision_explosion = new create_explosion(60, 63, players_list[play_i].x_pos, players_list[play_i].y_pos - 10, img_explosion, 1);
                explosion_list.push(collision_explosion);

                // Play sound
                let explosion_sound = new create_sound("explosion.wav");
                explosion_sound.play();

                /* Output the number of explosions in the array */
                console.log("created " + explosion_list);

                // Remove the player from the array
                players_list.splice(play_i, 1);

                // Decrement index
                play_i--;

                /* Output the number of players in the array */
                console.log(players_list);

                // Call player_death() to show the gameover screen
                player_death();
            }
        }
    }
}

/**
 * Function: explosion_bounds()
 *
 * -> This function checks if the referenced explosion has travelled its max distance that it can travel
 * -> The passed in parameters of ex_i references the enemy object in the enemy array at the index of ex_i
 */
function explosion_bounds(ex_i)
{
    // Check if the referenced explosion has travelled 15 pixels down vertically
    if (explosion_list[ex_i].distance_tracker == 15)
    {
        // Remove the explosion from the array
        explosion_list.splice(ex_i, 1);
        
        // Decrement index
        ex_i--;

        /* Testing only */
        console.log("destroyed " + explosion_list);

        // Return value
        return true;
    }
    else
    {
        // Return value
        return false;
    }
}

/***////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////***/