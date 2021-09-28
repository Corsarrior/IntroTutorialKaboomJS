// import kaboom lib
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

let score;

 // bakground mousic 
    const music = play("static01", {
    volume: 0.1,
    loop: true
    });

scene("intro", () => {

  function addButton(txt, f){
    const btn = add([
      text(txt, 8),
      pos(center()),
      area({cursor: "pointer", }),
      scale(1),
      origin("center"),
    ]);

    // clicks comes from area
    // if btn receive a click, do f action
    btn.clicks(f);

    btn.hovers(() => {
      const t = time() * 10;
      btn.color = rgb(
        wave(0, 255, t),
			  wave(0, 255, t + 2),
			  wave(0, 255, t + 4),
      );
      // Make a 2d vector.
      btn.scale = vec2(1.2);
      // What happen is not hover
      }, () => {
        btn.scale = vec2(1);
		    btn.color = rgb();
      }
    );
  }
  addButton("Start", () => go("game"));

})

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

    // collides come from area component
    tv.collides("tree", () => {
      go("lose"); // go to "lose" scene
      shake();
      addKaboom(tv.pos); 
    });

    score = 0;
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

  add([
      text("Score: " + score),
      pos(width() / 2, height() / 2 + 60),
      scale(0.4),
      origin("center"),
  ])

  // go back to game with space is pressed
  keyPress("space", () => go("game"));
  mouseClick(() => go("game"));
})

go("intro");



