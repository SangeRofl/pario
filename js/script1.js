const canv = document.getElementById('c');
const ctx = canv.getContext('2d');
let w;
let h;
alert("Anton Gan");
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
  canv.width = w = window.innerWidth;
  canv.height = h = window.innerHeight;
  ctx.translate(canv.width/2,canv.height/2);
}
resizeCanvas();

const fieldHeight = 3000;
const fieldWidth  = 3000;
const playerStartPosX = 0;
const playerStartPosY = 0;

const frameRatio = 1;

const MAX_HEALTH = 2000;
const MAX_DAMAGE = 150;
const MAX_SPEED = 50;
const MAX_BULLET_SPEED = 50;
const LEVELS = 10;

let W = false;
let A = false;
let S = false;
let D = false;

class Food{
    constructor(x, y){
        this.x = x
        this.y = y
        this.size = 10
    }
    collides(p){
        return(
            (p.x - this.x) * (p.x - this.x)
            +
            (p.y - this.y) * (p.y - this.y)
            <=
            (p.size - this.size) * (p.size - this.size) + this.size
        )
    }
}

class player 
{
    static contactZoneKf = 6;//определяет размер зоны pario
    constructor(x, y, size, angle, flag_Contact = false, speed = 3, maxHealth = 3, damage = 3, bulletSpeed = 3){
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = angle;
        this.speed = speed;
        this.health = maxHealth*MAX_HEALTH/LEVELS;
        this.maxHealth = maxHealth;
        this.damage = damage;
        this.bulletSpeed = bulletSpeed;
        this.flag_Contact = flag_Contact;
        this.speedVector = [0,0];
        }
    draw()
    {   
        ctx.fillStyle = "#115e0e"
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI)
        ctx.rect(-this.size/2+this.size*0.1,-this.size-this.size*0.8, this.size*0.8,0-(-this.size-this.size*0.8));
        ctx.stroke();
        ctx.fill()
        ctx.closePath();
    }
    drawContactZone()
    {
        ctx.fillStyle = "RGBA(178, 230, 178, 0.6)"
        ctx.beginPath()
        ctx.arc(0, 0, this.size*player.contactZoneKf, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath();
    }
    drawHealthBar()
    {
        ctx.fillStyle = "#ba2222"
        if(this.health>=0)
        {
            ctx.beginPath()
            ctx.rect(-this.size,this.size+ this.size*0.2, (this.size*2)*(this.health/(this.maxHealth*MAX_HEALTH/LEVELS)),this.size*0.3);
            ctx.fill()
            ctx.closePath();
        }
        ctx.beginPath()
        ctx.rect(-this.size,this.size+ this.size*0.2, this.size*2,this.size*0.3);
        ctx.stroke();
        ctx.closePath();
    }
    shoot()
    {
        new bullet(this.x, this.y, 15, this.angle, this.bulletSpeed, this.damage);
    //  console.log(Player.angle);
    }
    
    pario(pl)
    {
        let hp1 = this.health/(this.maxHealth*MAX_HEALTH/LEVELS)
        let hp2 = pl.health/(pl.maxHealth*MAX_HEALTH/LEVELS)

        let maxHP = this.maxHealth+pl.maxHealth;
        let speed = this.speed+pl.speed;
        let bulletSpeed = this.bulletSpeed+pl.bulletSpeed;
        let dmg = this.damage+pl.damage;
        console.log(maxHP, speed, bulletSpeed, dmg)
        this.maxHealth = Math.round(Math.random()*maxHP);
        pl.maxHealth = maxHP-this.maxHealth;
        this.speed = Math.round(Math.random()*speed);
        pl.speed = speed-this.speed;
        this.bulletSpeed = Math.round(Math.random()*bulletSpeed);
        pl.bulletSpeed = bulletSpeed-this.bulletSpeed;
        this.damage = Math.round(Math.random()*dmg);
        pl.damage = dmg-this.damage;
        this.health = this.maxHealth*hp1*MAX_HEALTH/LEVELS;
        pl.health = pl.maxHealth*hp2*MAX_HEALTH/LEVELS;
        
        this.flag_Contact = false;
        pl.flag_Contact = false;
    }
    inContact(p){
        return(
            (p.x - this.x) * (p.x - this.x)
            +
            (p.y - this.y) * (p.y - this.y)
            <=
            (p.size - this.size*player.contactZoneKf) * (p.size - this.size*player.contactZoneKf) + this.size
        ) && this.flag_Contact == true && p.flag_Contact == true;
    }
}
class bullet
{
    static Bullets = [];
    constructor(x, y, size, angle, speed, damage){
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = angle;
        this.speed = speed;
        this.damage = damage
        bullet.Bullets.push(this);
    }
    updateCoords()
    {
        this.x=this.x+this.speed*(Math.cos((-270+this.angle)*Math.PI/180));
        this.y=this.y-this.speed*(Math.sin((-270+this.angle)*Math.PI/180));
    }
    draw()
    {
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath();
    }
    collides(p){
        return(
            (p.x - this.x) * (p.x - this.x)
            +
            (p.y - this.y) * (p.y - this.y)
            <=
            (p.size - this.size) * (p.size - this.size) + this.size
        )
    }
}


class wall
{
    constructor(x1, y1, x2, y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw()
    {   
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();
        ctx.closePath();
    }
    collides(p)
    {
        let dist;
        let t = ((p.x-this.x1)*(this.x2-this.x1)+(p.y-this.y1)*(this.y2-this.y1))/((this.x2-this.x1)*(this.x2-this.x1)+(this.y2-this.y1)*(this.y2-this.y1))
        if(t<0)
        {
            t = 0;
        }
        else if(t>1)
        {
            t = 1;
        }
        dist = Math.sqrt((this.x1-p.x+(this.x2-this.x1)*t)*(this.x1-p.x+(this.x2-this.x1)*t)+(this.y1-p.y+(this.y2-this.y1)*t)*(this.y1-p.y+(this.y2-this.y1)*t))-p.size;
        if(dist>=0)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

}
function drawFood(x, y, size, color){

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(x,y,size,size)
    ctx.fill()
    ctx.closePath();
}

let food = []
let Player = new player(playerStartPosX, playerStartPosY, 50, 0, true,5,5,5,5);
let Wall = [];
let Players = [];
Players.push(new player(playerStartPosX-300, playerStartPosY, 50, 0, true,5,5,5,5))
Wall.push(new wall(300,300,340,300));
Wall.push(new wall(340,300,340,500));
Wall.push(new wall(340,500,300,500));
Wall.push(new wall(300,500,300,300));
Wall.push(new wall(-fieldWidth/2,-fieldHeight/2,fieldWidth/2,-fieldHeight/2));
Wall.push(new wall(fieldWidth/2,-fieldHeight/2,fieldWidth/2,fieldHeight/2));
Wall.push(new wall(fieldWidth/2,fieldHeight/2,-fieldWidth/2,fieldHeight/2));
Wall.push(new wall(-fieldWidth/2,fieldHeight/2,-fieldWidth/2,-fieldHeight/2));
//food.push(new Food(,))
setInterval(function(){
    food.push(new Food(Math.floor(Math.random() * fieldWidth)-fieldWidth/2, Math.floor(Math.random() * fieldHeight)-fieldHeight/2))
}, 10);

document.addEventListener('keydown', key)
function key(d){
    let speed = Player.speed*MAX_SPEED/LEVELS;
    switch(d.code){
        case 'KeyW':
            Player.y -= speed;
            Wall.forEach(function(e)
            {
                 if(e.collides(Player))
                 {
                    Player.y += speed;
                 }
            })
            break;
        case 'KeyA':
            Player.x -= speed
            Wall.forEach(function(e)
            {
                 if(e.collides(Player))
                 {
                    Player.x += speed
                 }
            })
            break;
        case 'KeyS':
            Player.y += speed
            Wall.forEach(function(e)
            {
                 if(e.collides(Player))
                 {
                    Player.y -= speed
                 }
            })
            break;
        case 'KeyD':
            Player.x += speed
            Wall.forEach(function(e)
            {
                 if(e.collides(Player))
                 {
                    Player.x -= speed
                 }
            })

            break;
    }
    

}


addEventListener('click', sh);
function sh(e){
    Player.shoot();
   //console.log("x:",x, "\ty:",y, "\tangle:", Player.angle);
  }


addEventListener('mousemove', pos, false);
function pos(e){
    let x = e.pageX-w/2;
    let y = -(e.pageY-h/2);
    //console.log((y)/(Math.sqrt(x*x+y*y)));
    let grad = (Math.acos((y)/(Math.sqrt((x*x+y*y))))/Math.PI)*180;
    if(x<0)
    {
        Player.angle = grad;
    }
    else
    {
        Player.angle = -grad;
    }
   //console.log("x:",x, "\ty:",y, "\tangle:", Player.angle);
  }
function update()
{
    ctx.fillStyle = 'white';
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.translate(playerStartPosX-Player.x, playerStartPosY-Player.y);
    food.forEach(function(e){
        drawFood(e.x, e.y, e.size, 'red')
    })
    Wall.forEach(function(e){
        e.draw();
    })
    bullet.Bullets.forEach(function(e){
        e.updateCoords();
        e.draw();
        Players.forEach(function(p)
        {
            if(e.collides(p))
            {
                p.health-=e.damage*MAX_DAMAGE/LEVELS;
                bullet.Bullets=bullet.Bullets.filter(value => value.x!=e.x && value.y!=e.y && value.angle!=e.angle);
            }
            
        })
    })

    Players.forEach(function(p)
    {
    if(Player.inContact(p))
    {
        console.log("YES!");
        Player.pario(p);
    }
    if(p.health>0)
    {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle*Math.PI/180);
        if(p.flag_Contact == true)
        p.drawContactZone();
        p.draw();
        ctx.rotate(-p.angle*Math.PI/180);
        p.drawHealthBar(0, 0);
        ctx.translate(-p.x, -p.y);
    }
    else
    {
        p.size=0;
        p.x=fieldWidth-1000;
        p.y=fieldHeight-1000;
    }
})
    ctx.translate(-(playerStartPosX-Player.x), -(playerStartPosY-Player.y));
    ctx.rotate(-Player.angle*Math.PI/180);
    if(Player.flag_Contact == true)
    Player.drawContactZone();
    Player.draw();
    ctx.rotate(+Player.angle*Math.PI/180);
    Player.drawHealthBar();
    
}

setInterval(function(){Players[0].angle+=1;Players[0].y+=0;update();}, frameRatio); //Player.angle= Player.angle+1