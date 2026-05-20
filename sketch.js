var pc, pc_img , pc_run , pc_jmp, pc_lose, stepback_img, hurt_img
var bg, bg_img
var invflr
var gamestate = "play"
var platform, platform_img, platform_grp
var coin, coin_img, coin_grp
var gem, gem_img, gem_grp
var lazer, laze_img, laze_grp
var rocks, rocks_img, rocks_grp
var invtop
var score = 0
var life = 3
var invwall
var plode, plode_img

function preload ()
{
    pc_img = loadAnimation ("Asset/pc_stand.png")
    bg_img = loadImage ("Asset/bg.png")
    pc_run = loadAnimation ("Asset/run1.png", "Asset/run2.png", "Asset/run3.png")
    platform_img = loadImage ("Asset/platform.png")
    pc_jmp = loadAnimation ("Asset/jmp2.png")
    coin_img = loadImage ("Asset/coin-removebg-preview.png")
    stepback_img = loadAnimation ("Asset/stepback1.png", "Asset/stepback2.png", "Asset/stepback3.png")
    gem_img = loadAnimation ("Asset/g1-removebg-preview.png", "Asset/g2-removebg-preview.png", "Asset/g3-removebg-preview.png", "Asset/g4-removebg-preview.png", "Asset/g5-removebg-preview.png", "Asset/g6-removebg-preview.png")
    laze_img = loadImage ("Asset/lazer.png")
    rocks_img = loadImage ("Asset/rocks.png")
    plode_img = loadAnimation ("Asset/boom1.png", "Asset/boom2.png", "Asset/boom3.png", "Asset/boom4.png")
    hurt_img = loadAnimation ("Asset/hurt_pc.png")
}

function setup ()
{
    createCanvas (1271.8, 588)
    bg = createSprite (600, 300, 1271.8, 588)
    bg.addImage (bg_img)
    bg.scale = 0.4

    pc = createSprite (200, 500)
    pc.addAnimation ("breathing", pc_img)
    pc.addAnimation ("running", pc_run)
    pc.addAnimation ("jumping", pc_jmp)
    pc.addAnimation ("backsteps", stepback_img)
    pc.addAnimation ("beat", hurt_img)

    invflr = createSprite (600, 560, 1390, 5)
    invflr.visible = false

    invtop = createSprite (600, 10, 1390, 5)
    invtop.visible = false

    invwall = createSprite (0, 300, 5, 610)
    invwall.visible = false

    platform_grp = new Group ()
    coin_grp = new Group ()
    gem_grp = new Group ()
    laze_grp = new Group ()
    rocks_grp = new Group ()
}

function draw ()
{
    background ("blue")
    drawSprites ();

    // var bar = createSprite (60, 120)

    pc.collide (invflr)
    pc.collide (invwall)

    textSize (35)
    fill ("white")
    text ("Score = " +score, pc.x - 60, pc.y - 95)

    text ("Lives = " +life, pc.x - 60, pc.y - 125)


    if (gamestate == "play")
    {

        bg.velocityX = -6
        if (bg.x < 0)
        {
            bg.x = 1200
        }

        if (pc.x < 0)
        {
            pc.x = 2
        }

        if (keyWentUp ("d") && pc.y > 456)
        {
            pc.changeAnimation ("breathing")
        }
        if (keyDown ("up"))
        {
            pc.velocityY = -10
            pc.changeAnimation ("jumping") 
        }
            if (pc.collide (invflr) || pc.y > 466)
            {
                pc.changeAnimation ("breathing")
            }
        if (pc.y > 459)
        {
            if (keyDown ("d"))
        {
            pc.changeAnimation ("running")
            pc.x = pc.x + 3
        }

        if (keyDown ("a"))
        {
            pc.x = pc.x - 5
            pc.changeAnimation ("backsteps")
        }
        }

        if (pc.y < 460 && keyDown ("d"))
        {
            pc.x = pc.x + 3
        }

        if (pc.y < 460 && keyDown ("a"))
        {
            pc.x = pc.x - 3
        }

        if (pc.isTouching (invtop))
        {
            pc.collide (invtop)
        }

        if (platform_grp.isTouching (pc))
        {
            pc.collide (platform_grp)
            pc.changeAnimation ("breathing")
            if (keyDown ("d"))
            {pc.x = pc.x + 3}

            if (keyDown ("a"))
            {
                pc.x = pc.x -3
            }
        }
        // checking collision

        coin_grp.isTouching (pc, destroy_coin)
        laze_grp.isTouching (pc, destroy_lazer)
        gem_grp.isTouching (pc, destroy_gem)
        rocks_grp.isTouching (pc, destroy_rocks)


        if (score < 0)
        {
            score = 0
        }


        // gravity
        pc.velocityY += 0.5

        spawn_platform ()
        spawn_gem ()
        spawn_lazers ()
        spawn_rocks ()

        if (life < 0)
        {
            gamestate = "end"
        }
    }

    if (gamestate == "end")
    {
        platform_grp.destroyEach ()
        coin_grp.destroyEach ()
        laze_grp.destroyEach ()
        gem_grp.destroyEach ()
        rocks_grp.destroyEach ()

        game_over ()
}
}

function spawn_platform ()
{
    var r = World.frameCount % 120
    if (r == 0)
    {
    var t = random (200, 500)         
    platform = createSprite (1300, t)
    platform.addImage (platform_img)
    platform.velocityX = -5
    platform.scale = 0.4
    platform.lifetime = 1300/5
    platform_grp.add (platform)

    coin = createSprite (1300, platform.y - 40)
    coin.addImage (coin_img)
    coin.velocityX = -5
    coin.scale = 0.2
    coin.lifetime = 1300/5
    coin_grp.add (coin)

    }
}

function spawn_gem ()
{
    // var b = Math.round (random (150, 170))
    const b = [50, 150, 250, 350, 450]
    const b_index = Math.floor (Math.random () * 5)
    const b_number = b [b_index]
    var m = World.frameCount % b_number
    if (m == 0)
    {
    gem = createSprite (1300, random (200, 500))
    gem.addAnimation ("gem", gem_img)
    gem.velocityX = -7
    gem.lifetime = 1300/7
    gem.scale = 1.5
    gem_grp.add (gem)
    }
}

function spawn_lazers ()
{
    var y = World.frameCount % 100
    if(y == 0)
    {
    var o = random (7, 12)
    lazer = createSprite (1300, random (200, 505))
    lazer.addImage ("blast", laze_img)
    lazer.velocityX = -o
    lazer.lifetime = 1300/o
    laze_grp.add (lazer)
    }
}

function spawn_rocks ()
{
    var a = World.frameCount % 90
    if(a == 0)
    {
        rocks = createSprite (random (100, 950), -20)
        rocks.addImage ("rocky", rocks_img)
        rocks.velocityY = +10
        rocks.lifetime = 588/10
        rocks.scale = 0.5
        rocks_grp.add (rocks)
    }
}

function destroy_coin (coin)
{
    score = score +2
    coin.destroy ()
}

function destroy_lazer (lazer)
{
    life = life -1
    lazer.destroy ()
    plode = createSprite (pc.x + 90, pc.y)
    plode.addAnimation ("explode", plode_img)
    plode.lifetime = 10
}

function destroy_gem (gem)
{
    score = score + 5
    gem.destroy ()
}

function destroy_rocks (rocks)
{
    score = score -4
    rocks.destroy ()
}

function game_over ()
{
     swal ({
        title : "GAME OVER!", 
        text : "You're such a Loser >:)",
        imageUrl : "Asset/hurt_pc.png",
        imageSize : "150x150",
        confirmButtonText : "Try Again ?"
            },
        function (b)
        {
        if (b)
        {
            location.reload ()
        }
        })
}