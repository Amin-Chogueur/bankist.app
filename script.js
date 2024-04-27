"use strict"
console.log("there are two accounts in this app, to try it log in with (user:ca , pin:1111) or (user:bm , pin:2222)")
// accounts data
const account1={
    owner:"Chogueur Amin",
    movments:[200,450,-400,3000,-650,-130,70,1300],
    intersetRate:1.2,
    pin:1111,
    movmentsDates:[
        "2019-11-30T21:31:05.178Z",
        "2019-12-06T16:34:06.383Z",
        "2020-01-15T23:35:07.904Z",
        "2020-01-20T18:41:05.185Z",
        "2020-04-30T06:37:12.194Z",
        "2020-06-16T12:52:28.929Z",
        "2020-10-10T15:42:45.178Z",
        "2020-12-13T18:08:34.790Z",
    ],
    locale:"en-US"
};
const account2={
    owner:"Bambrik Malika",
    movments:[5000,3400,-150,-790,-3210,-1000,8500,-30],
    intersetRate:1.5,
    pin:2222,
    movmentsDates:[
        "2019-11-30T21:31:05.178Z",
        "2019-12-06T16:34:06.383Z",
        "2020-01-15T23:35:07.904Z",
        "2020-01-20T18:41:05.185Z",
        "2020-04-30T06:37:12.194Z",
        "2020-06-16T12:52:28.929Z",
        "2020-10-10T15:42:45.178Z",
        "2020-12-13T18:08:34.790Z",
    ],
    locale:"en-US"
};

const accounts=[account1,account2]
// declaire varibles
const welcomeMessage=document.querySelector(".welcome-message");
const username=document.querySelector('.username');
const pin=document.querySelector(".pin");
const submitUser=document.querySelector(".submit-user");
const curentDate=document.querySelector(".curent-date");
const balance=document.querySelector(".balance");
const submitTransfer=document.querySelector(".submit-transfer");
const usertToTransfer=document.querySelector(".user-to-transfer");
const amountToTransfer=document.querySelector(".amount-to-transfer");
const submitLoan=document.querySelector(".submit-loan");
const loanAmount=document.querySelector(".loan-amount")
const submitClose=document.querySelector(".submit-close");
const accountToClose=document.querySelector(".account-to-close")
const pinToClose=document.querySelector(".pin-to-close")
const depositSome=document.querySelector(".in")
const withdrawalSome=document.querySelector(".out");
const interset=document.querySelector(".interest");
const logOut=document.querySelector(".timer");
const allMovments=document.querySelector(".movments");
const bodyApp=document.querySelector(".body-app ");

/*function username*/

const usernamefrom=function(users){
    users.forEach(user=>{
       user.username=user.owner.split(" ").map(str=>str[0]).join("").toLowerCase()
    });
};
usernamefrom(accounts);
/* function log in */
let curentUser,timer;
submitUser.addEventListener("click",function(e){
    e.preventDefault();
    let login=false
    curentUser=accounts.find(account=>account.username===username.value );
    if(curentUser?.pin===+pin.value) {
        bodyApp.style.opacity="100";
        login=true;
    }
    if(login){
        welcomeMessage.textContent=`Good day, ${curentUser.owner}!`
        showData(curentUser);
        calcAccInfo( curentUser);
        clearInterval(timer)
        startCountingToLogOut();
    }
    else{
        welcomeMessage.textContent=`Oops! Wrong  Username or  PIN, try again!  `
        bodyApp.style.opacity="0";
    }
    username.value="";
    pin.value="";
    pin.blur()
})
/* function count to log out user */
const startCountingToLogOut=function(){
    let time=600;
    const tick=function(){
        let min=`${Math.trunc(time/60)}`.padStart(2,0);
        let sec=String(time%60).padStart(2,0);
        logOut.innerHTML=`${min}:${sec}`;
       
        if(time===0){
            clearInterval(timer)
            welcomeMessage.textContent=`Log in to get started  `
            bodyApp.style.opacity="0";
        }
        time--;
    }
    tick();
     timer=setInterval(tick,1000)
     return timer;
}

/* function show data*/
const showData=function(curentUser){
    curentDate.innerHTML=`As of ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`
    allMovments.innerHTML="";
    curentUser.movments.forEach((movment,i)=>{
        let movmentDay=new Date(curentUser.movmentsDates[i]).toLocaleDateString()
        let rslt= `
            <div class="movment" style="background-color:${i%2!==0 ? "#ddd": ""}">
                <div class="movment-type">
                    <span style="background-color:${movment<0 ? "red": "green"}"class="type">${i+1}: ${movment<0 ? "withdrawal" : "deposit"}</span>
                    <span class="movment-date">${movmentDay}</span>
                </div><!-- movment-type -->
                <p class="movment-amount">$${movment.toFixed(2)}</p>
            </div>`;
            allMovments.insertAdjacentHTML("afterbegin",rslt);
    });
};

/* function calculate balance, interest, deposit and withdrawal*/

const calcAccInfo=function(account){
    let deposit=account.movments.filter(mov=>mov>0).reduce((acc,dep)=>acc+dep,0)
    depositSome.textContent=`$${deposit.toFixed(2)}`;

    let withdrawal=account.movments.filter(mov=>mov<0).reduce((acc,dep)=>acc+dep,0);
    withdrawalSome.textContent=`$${Math.abs(withdrawal).toFixed(2)}`;

    let intrst=account.movments.filter(mov=>mov>0).map(dep=>(
        dep*account.intersetRate)/100).filter(inter=>inter>=1).reduce((acc,inter)=>acc+inter);
    interset.textContent=`$${intrst.toFixed(2)}`;

    let balnc=account.movments.reduce((acc,mov)=>acc+mov,0);
    account.balance=balnc+intrst;
    balance.textContent=`$${(balnc+intrst).toFixed(2)}`;
}

/*function transfer money*/
submitTransfer.addEventListener("click",function(e){
    e.preventDefault()
    let receiver=accounts.find((account=>account.username===usertToTransfer.value))
    if(receiver && receiver.username!==curentUser.username&& +amountToTransfer.value>0 && curentUser.balance >= +amountToTransfer.value ){
        receiver.movments.push(+amountToTransfer.value);
        receiver.movmentsDates.push(`${new Date().toISOString()}`);
       curentUser.movments.push(-amountToTransfer.value);
       curentUser.movmentsDates.push(`${new Date().toISOString()}`);
       showData(curentUser);
       calcAccInfo( curentUser);
       usertToTransfer.value=amountToTransfer.value=""
    }else{
        console.log("wrong operation")
    }
    clearInterval(timer)
    startCountingToLogOut();
})

/* function close account */
submitClose.addEventListener("click",function(e){
    e.preventDefault()
    console.log(accountToClose.value,pinToClose.value)
    if(curentUser.username===accountToClose.value && curentUser.pin===+pinToClose.value){
       let i=accounts.findIndex(account=>account.username===accountToClose.value)
       accounts.splice(i,1)
       welcomeMessage.textContent=`your account has been deleted!  `
        bodyApp.style.opacity="0";
        accountToClose.value=pinToClose.value="";
    }
})

/* function get loan */
submitLoan.addEventListener("click",function(e){
    e.preventDefault()
    if(+loanAmount.value>0 && curentUser.movments.some(deposit=>deposit>=+loanAmount.value*0.1)){
        curentUser.movments.push(Math.floor(loanAmount.value));
        curentUser.movmentsDates.push(`${new Date().toISOString()}`);
        setTimeout(function(){
            showData(curentUser);
            calcAccInfo( curentUser);
        },2000)
        loanAmount.value=""
    }
    clearInterval(timer)
    startCountingToLogOut();
})
