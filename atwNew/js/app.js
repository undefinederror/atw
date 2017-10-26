function GameSettings(options){
    this.letters = options;                        
    this.lettersEl = document.querySelectorAll("li");                    
    this.newGameLetter = [];
    this.questionsArray = [];
    this.questions = [];
    this.correctAnswer = [];
    this.questionAssign(this.letters);
    this.activeQuestionEl();
    this.cd;
    this.gp;
    this.gameStarted = false;
    this.gameFinished = false;           
    this.start();
};
GameSettings.prototype.questionAssign = function(obj){
    Object.keys(obj).forEach(function(key) {
        this.newGameLetter.push(key);
        this.questionsArray.push(obj[key]);                    
    }.bind(this));

    for (var i=0; this.questionsArray.length > i; i++){                
        var random = [Math.floor(Math.random()*this.questionsArray[i].length)]
        this.questions[i] = this.questionsArray[i][random]
        //this.lettersEl[i].innerHTML = this.questions[i][1];
        this.correctAnswer[i] = this.questions[i][0]
        console.log(this.questions[i][1], "-------------  " + this.questions[i][0]);
    }            
};
GameSettings.prototype.countDown = function(obj){

};       
GameSettings.prototype.activeQuestionEl = function(obj){
    for (var i=0; this.lettersEl.length >i; i++){
        this.lettersEl[i].setAttribute("data-active","false"); 
        this.lettersEl[0].setAttribute("data-active","true"); 
        this.lettersEl[i].setAttribute("data-answered","false");
        this.lettersEl[i].setAttribute("data-correct","");
        this.lettersEl[i].setAttribute("data-passed","false");
    }           
};
GameSettings.prototype.start = function(obj){
    this.gameStarted = true;
    this.gp = new GamePlay(this.lettersEl, this);
    this.cd = new CircularCntdwn(this);            
};
GameSettings.prototype.finish = function(obj){
    this.gameFinished = true;
    return true;
};

function GamePlay(el,gs){
    this.input = document.getElementById("answer");
    this.inputQ = document.getElementById("question");
    this.currentQ;
    this.activeL = [];
    this.answeredL = [];
    this.correctL = [];
    this.passedL = [];
    for(var i=0; el.length > i; i++){
        this.activeL[i] = el[i].getAttribute("data-active");
        this.answeredL[i] = el[i].getAttribute("data-answered");
        this.correctL[i] = el[i].getAttribute("data-correct");
        this.passedL[i] = el[i].getAttribute("data-passed");
    }            
    console.log(this.activeL,this.answeredL,this.correctL);
    this.toResponde = [];
    this.firstPlayComplete = false;
    this.gamedataArray;
    this.letterArray;
    //this.interaction(gs);
    this.interaction2(gs);
    this.keyListener(gs);

};
GamePlay.prototype.interaction2 = function(gs){
    //start new game settings 
    // *** question/answer to start
    var currentAnswer, currentQuestionAssociated;

    // *** element in the view
    var currentEl, prevEl, nextEl;

    this.gamedataArray = []; 
    //if (this.firstPlayComplete){

      //  var letterArray = this.toResponde;
    //}
    this.letterArray = this.firstPlayComplete?this.toResponde:gs.lettersEl;
    for (var i=0; this.letterArray.length > i; i++){                
        var passed = this.letterArray[i].getAttribute("data-passed") == "false";
        if (this.letterArray[i].getAttribute("data-answered") == "false" && passed){
            console.log("not passed");
            var index = parseInt(this.letterArray[i].id.replace("q",""));                     
            currentEl = this.letterArray[i];                     
            currentEl.setAttribute("data-active","true");
            currentEl.classList.remove("passed");
            currentEl.classList.add("active");
            //currentEl.style.background = "#999";

            currentAnswer = gs.questions[index][0];                     
            currentQuestionAssociated = "<strong>"+gs.questions[index][1]+"</strong>";                    
            this.inputQ.innerHTML = currentQuestionAssociated;

            this.gamedataArray.push(i);
            this.gamedataArray.push(currentEl);
            this.gamedataArray.push(currentQuestionAssociated);
            this.gamedataArray.push(currentAnswer);                   

            break;
        } 
        /*if (this.gamedataArray ==[]){
            console.log("gioco finito");
        }*/
    }           
    console.log(this.gamedataArray);
};       
GamePlay.prototype.checkAnswer = function(gs){
    if (this.gamedataArray[3] != undefined){  
        console.log(this.letterArray.length);
        if (this.input.value.toLowerCase() == this.gamedataArray[3].toLowerCase() && this.input.value.toLowerCase() != ""){  
            console.log("giustoooo!!!");
            this.gamedataArray[1].setAttribute("data-active","false");
            this.gamedataArray[1].setAttribute("data-answered","true");
            this.gamedataArray[1].setAttribute("data-correct","true");
            this.gamedataArray[1].classList.remove("active");
            this.gamedataArray[1].classList.remove("passed");
            this.gamedataArray[1].classList.add("right");
            //this.gamedataArray[1].style.background = "green";
        } else if (this.input.value.toLowerCase() != this.gamedataArray[3].toLowerCase() && this.input.value.toLowerCase() != "")  {
            console.log("sbagliatoooo!!!");
            this.gamedataArray[1].setAttribute("data-active","false");
            this.gamedataArray[1].setAttribute("data-answered","true");
            this.gamedataArray[1].setAttribute("data-correct","false");
            //this.gamedataArray[1].style.background = "red";
            this.gamedataArray[1].classList.remove("active");
            this.gamedataArray[1].classList.remove("passed");
            this.gamedataArray[1].classList.add("wrong");
        } else if (this.input.value.toLowerCase() == "")  {
           this.passed();
        }
    } 
    if (this.gamedataArray[0] == (this.letterArray.length-1)){ 
        this.firstPlayComplete = true;
        console.log("giro finito");
        this.checkNotAnswered(gs);
        this.finish(gs);                
    }
    this.input.value = "";
};
GamePlay.prototype.passed = function(gs){
    console.log("passaparola");
    this.gamedataArray[1].setAttribute("data-active","false");
    this.gamedataArray[1].setAttribute("data-answered","false");
    this.gamedataArray[1].setAttribute("data-correct","false");            
    this.gamedataArray[1].setAttribute("data-passed","true");    
    this.gamedataArray[1].classList.remove("active");
    this.gamedataArray[1].classList.add("passed");  
    //this.gamedataArray[1].style.background = "yellow";   
};
GamePlay.prototype.keyListener = function(gs){
    this.input.addEventListener('keyup', function (e) {
        if (e.keyCode == 13) {                    
            this.checkAnswer(gs);                   
            this.interaction2(gs);                   
         }
    }.bind(this));
    this.input.addEventListener('keyup', function (e) {
        if (e.keyCode == 40) {
            this.passed(gs);
            this.interaction2(gs);   
        }
    }.bind(this));
};
GamePlay.prototype.checkNotAnswered = function(gs){
    this.toResponde = [];
    for (var i=0; gs.lettersEl.length > i; i++){
        if (gs.lettersEl[i].getAttribute("data-answered") == "false"){
            this.toResponde.push(gs.lettersEl[i]);
            gs.lettersEl[i].setAttribute("data-passed","false");
        }                
    }
    console.log(this.toResponde);            
};
GamePlay.prototype.finish = function(gs){
    var right = 0;
    var wrong = 0;
    if (this.toResponde.length == 0){
        this.input.disabled = true;
        clearInterval(gs.cd.interval);
        for (var i=0; gs.lettersEl.length > i; i++){
            console.log("gioco finito");
            gs.lettersEl[i].setAttribute("data-answered","true");                    
            if (gs.lettersEl[i].getAttribute("data-correct") == "true"){
                right++                       
            } else {
                wrong++
                gs.lettersEl[i].classList.remove("active");
                gs.lettersEl[i].classList.remove("passed");
                gs.lettersEl[i].classList.add("wrong");
                //gs.lettersEl[i].style.background = "red";
            }
        }               
    }
    console.log("giuste","---------------",right);
    console.log("sbagliate","---------------",wrong);
};
GamePlay.prototype.timeout = function(gs){
    var right = 0;
    var wrong = 0;
    if (gs.cd.stop){
        this.input.disabled = true;
        for (var i=0; gs.lettersEl.length > i; i++){
            console.log("gioco finito");
            gs.lettersEl[i].setAttribute("data-answered","true");                    
            if (gs.lettersEl[i].getAttribute("data-correct") == "true"){
                right++                       
            } else {
                wrong++
                gs.lettersEl[i].classList.remove("active");
                gs.lettersEl[i].classList.remove("passed");
                gs.lettersEl[i].classList.add("wrong");
                //gs.lettersEl[i].style.background = "red";                
            }
        }       
    }
    console.log("giuste","---------------",right);
    console.log("sbagliate","---------------",wrong);    
};

function CircularCntdwn(gs){            
    this.time = 120;           
    this.svg = document.querySelector('.circle_animation');
    this.timeMin = document.querySelector('h2 span#min');
    this.timeSec = document.querySelector('h2 span#sec');
    this.timeField = document.querySelector('h2');            
    this.initialOffset = '785'//'440';
    this.stop = false;
    i = 1
    this.interval = setInterval(function() {                
        this.svg.style.strokeDashoffset = this.initialOffset-(i*(this.initialOffset/this.time));
        //this.timeSec.innerHTML = this.time -i;               
        this.timeMin.innerHTML = this.formatSeconds(this.time-i);
        //this.time--;               
        if (i >= (this.time / 2)*1 && i <= ((this.time / 2)*1)+2) { 
            this.svg.style.stroke = "#ffd000";
            console.log("quartile1");                   
        } else if (i >= (this.time / 3)*2 && i <= ((this.time / 3)*2)+2) {
            this.svg.style.stroke = "#ff9d00";
            console.log("quartile2")
        } else if (i >= (this.time / 4)*3 && i <= ((this.time / 4)*3)+2) {
            this.svg.style.stroke = "#ff0000";
            console.log("quartile3")
        } 
        if (i == this.time) {
            clearInterval(this.interval);
            this.stop = true;
            setTimeout(function(){
                //this.stop = true;
                gs.gp.timeout(gs);
            },1000);

        }
        i++;  
    }.bind(this), 1000);            
};
CircularCntdwn.prototype.formatSeconds = function(secs) {
    function pad(n) {
        return (n < 10 ? "0" + n : n);
    }                          
    var m = Math.floor(secs / 60);
    var s = Math.floor(secs - m * 60);
    return pad(m) + ":" + pad(s);
};

var a = new GameSettings(qa);

//circle placement
function Views(container, items){
    this.radius = 150;
    this.fields = document.querySelectorAll(items);
    this.container = document.getElementById(container);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.angle = 4.7;
    this.step = (2*Math.PI) / this.fields.length;
    this.tl = new TimelineMax();
    console.log(this.tl);
    this.circularShow();    
};
Views.prototype.circularShow = function(){
    TweenMax.set(".itemQ",{autoAlpha:0});
    for (var i=0;this.fields.length > i; i++){
        var x = Math.round(this.width/2 + this.radius * Math.cos(this.angle) - this.fields[i].offsetWidth/2);   
        var y = Math.round(this.height/2 + this.radius * Math.sin(this.angle) - this.fields[i].offsetHeight/2);      
        //this.fields[i].style.left=x+"px";
        //this.fields[i].style.top=y+"px";
        this.tl.to(this.fields[i],0.4,{autoAlpha:1,left:x+"px",top:y+"px"},"-=0.3").play();
        this.angle += this.step; 
    }
    
    document.getElementById("btn").onclick = function(){
        this.angle = -2;
        for (var i=0;this.fields.length > i; i++){
            var x = Math.round(this.width/2 + this.radius * Math.cos(this.angle) - this.fields[i].offsetWidth/2);   
            var y = Math.round(this.height/2 + this.radius * Math.sin(this.angle) - this.fields[i].offsetHeight/2);
            if(window.console) {
                console.log(x, y);
            }
            this.fields[i].style.left=x+"px";
            this.fields[i].style.top=y+"px";                
            this.angle += this.step; 
        } 
    }.bind(this);
};
var circle = new Views("qWrap",".itemQ");