let ws = new WebSocket("ws://localhost:8000/ws");

const canv = document.getElementById('c');
const ctx = canv.getContext('2d');
let w;
let h;
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
  canv.width = w = window.innerWidth;
  canv.height = h = window.innerHeight;
  ctx.translate(canv.width/2,canv.height/2);
}
resizeCanvas();

let W = false;
let A = false;
let S = false;
let D = false;

MAX_HEALTH = 1000
LEVELS = 10


document.addEventListener('keydown', key)
function key(d){
    switch(d.code){
        case 'KeyW':
            W=true;
            break;
        case 'KeyA':
            A=true;
            break;
        case 'KeyS':
            S=true;
            break;
        case 'KeyD':
            D=true;
            break;
    }
}

document.addEventListener('keyup', gey)
function gey(p){
    switch(p.code){
        case 'KeyW':
            W=false;
            break;
        case 'KeyA':
            A=false;
            break;
        case 'KeyS':
            S=false;
            break;
        case 'KeyD':
            D=false;
            break;
    }
}


setInterval(function()
{
    if (W == true) 
    {
        ws.send("W");
        console.log("W is pressed")
    }
    // else if(W == false)
    // {
    //     ws.send("not W");
    // } 

    if (A == true) 
    {
        ws.send("A");
    }
    // else if(A == false)
    // {
    //     ws.send("not A");
    // } 

    if (S == true) 
    {
        ws.send("S");
    }
    // else if(S == false)
    // {
    //     ws.send("not S");
    // } 

    if (D == true)
    { 
        ws.send("D");
    }
    // else if(D == false){
    //     ws.send("not D");
    // } 
}, 50);


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
        ctx.rotate(-Player.angle*Math.PI/180);
        ctx.fillStyle = "#115e0e"
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, 2 * Math.PI)
        ctx.rect(-this.size/2+this.size*0.1,-this.size-this.size*0.8, this.size*0.8,0-(-this.size-this.size*0.8));
        ctx.stroke();
        ctx.fill()
        ctx.closePath();
        ctx.rotate(+Player.angle*Math.PI/180);
    }
    drawStatBars()
    {    
        ctx.font = "italic 30pt Arial";
        ctx.fillStyle = "RGBA(43, 219, 78, 1)";
        ctx.fillText("Max health:\t"+String(Player.maxHealth), -w/2+20, h/2-300);
        ctx.strokeStyle = "RGBA(0, 0, 0, 1)";
        ctx.strokeText("Max health:\t"+String(Player.maxHealth), -w/2+20, h/2-300);
        
        ctx.fillStyle = "rgba(215, 221, 55, 1)";
        ctx.fillText("Speed:\t"+String(Player.speed), -w/2+20, h/2-250);
        ctx.strokeText("Speed:\t"+String(Player.speed), -w/2+20, h/2-250);

        ctx.fillStyle = "rgba(243, 29, 29, 1)";
        ctx.fillText("Damage:\t"+String(Player.damage), -w/2+20, h/2-200);
        ctx.strokeText("Damage:\t"+String(Player.damage), -w/2+20, h/2-200);

        ctx.fillStyle = "rgba(29, 147, 242, 1)";
        ctx.fillText("Bullet speed:\t"+String(Player.bulletSpeed), -w/2+20, h/2-150);
        ctx.strokeText("Bullet speed:\t"+String(Player.bulletSpeed), -w/2+20, h/2-150);
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
    // shoot()
    // {
    //     new bullet(this.x, this.y, 15, this.angle, this.bulletSpeed, this.damage);
    // //  console.log(Player.angle);
    // }
    
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
let Player = new player(0, 0, 100, 0)
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
function drawFood(x, y, size, color){

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(x,y,size,size)
    ctx.fill()
    ctx.closePath();
}
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
trash = []

ws.onmessage = function(e){
    
    ctx.fillStyle = 'white';
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.translate(-Player.x, -Player.y);
    data = JSON.parse(e.data);
    data.generated.trash.forEach(function(e){
        trash.push(new Food(e.x, e.y));
    })
    trash.forEach(function(e){
        drawFood(e.x, e.y, 10, "red");
    })
    Player.x = data.pos.x;
    Player.y = data.pos.y;
    console.log(Player.x, Player.y);
    ctx.translate(Player.x, Player.y);
    ctx.rotate(-Player.angle*Math.PI/180);
    Player.draw()
    ctx.rotate(+Player.angle*Math.PI/180);
  }
