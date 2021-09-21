import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("tv", "sprites/tv.png");
loadSound("dead", "sounds/die_sound.wav");
loadSound("static01", "sounds/tv_static.wav");

 // bakground mousic 
    const music = play("static01", {
    volume: 0.1,
    loop: true
    });

scene("game", () => {
  
    // define gravity
    gravity(2400);

   music.play();
    
    // add a game object to screen
    const tv = add([
      // list of components
        sprite("tv"),
        pos(80, 40),
        area(),
        body(),
    ])

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        pos(0, height()),
        outline(4),
        origin("botleft"),
        area(),
        solid(),
        color(127, 200, 255),
    ])
    
    function jump(){
        // grounded comes from body component
        if(tv.grounded()){
          tv.jump(JUMP_FORCE);
      }
    }

    keyPress("space", jump);
    mouseClick(jump);

    function spawnTree(){
      const tree = add([
          rect(48, rand(32, 96)) ,
          area(),
          outline(4),
          pos(width(), height() - FLOOR_HEIGHT),
          // origin change pos
          origin("botleft"), 
          color(255, 180, 255),
          move(LEFT, SPEED), 
          "tree", // tag
      ]); 
      // We are calling spawnTree recursively
      wait(rand(0.5, 1.5), () => {
        spawnTree();
      });
    }

    spawnTree();

    // collides comes from area component
    tv.collides("tree", () => {
      go("lose"); // go to "lose" scene
      shake();
      addKaboom(tv.pos); 
    });

    let score = 0;
    const scoreLabel = add([
        text(score),
        pos(24, 24)
    ])

    // increment score every frame
    action(() => {
        score++;
        scoreLabel.text = score;
    });
}) 

/*
// the first argument is the time in seconds
loop(1, () => {
// add tree
  const tree = add([
      rect(48, rand(24, 64)) ,
      area(),
      outline(4),
      pos(width(), height() - 48),
      // origin change pos
      origin("botleft"), 
      color(255, 180, 255),
      move(LEFT, 240),
      "tree", // tag
  ]); 
})
*/

scene("lose", () => {

  play("dead");

  music.pause();
 
  add([
      sprite("tv"),
      pos(width() / 2, height() / 2 - 80),
      scale(2),
      origin("center"),
  ]);

    // display score
  add([
      text("Game Over"),
      pos(center()),
      origin("center"),
  ])

  // go back to game with space is pressed
  keyPress("space", () => go("game"));
  mouseClick(() => go("game"));
})

go("game")



