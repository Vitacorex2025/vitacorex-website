

const counters=document.querySelectorAll('.counter');

counters.forEach(counter=>{

const update=()=>{

const target=+counter.getAttribute('data-target');
const count=+counter.innerText;
const inc=target/100;

if(count<target){

counter.innerText=Math.ceil(count+inc);
setTimeout(update,25);

}else{

counter.innerText=target;

}

};

update();

});


function calculateROI(){

let revenue=parseFloat(document.getElementById("revenue").value)||0;
let ar=parseFloat(document.getElementById("ar").value)||0;
let agency=parseFloat(document.getElementById("agency").value)||0;

let recovered=ar*0.15;
let saved=recovered*(agency/100);

document.getElementById("result").innerHTML=
"<br>Estimated additional recovered cash: $"+Math.round(recovered)+
"<br>Agency fees avoided: $"+Math.round(saved);

}

