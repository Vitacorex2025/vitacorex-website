
function animate(id,target){
let el=document.getElementById(id)
let i=0
let int=setInterval(()=>{
i++
el.innerText=i
if(i>=target)clearInterval(int)
},30)
}

animate('k1',20)
animate('k2',40)
animate('k3',90)

function calc(){
let ar=parseFloat(document.getElementById('ar').value)||0
let fee=parseFloat(document.getElementById('fee').value)||0

let recovered=ar*0.15
let saved=ar*(fee/100)

document.getElementById('result').innerText=
"Estimated hidden recovery: $"+Math.round(recovered)+" | Agency fees saved: $"+Math.round(saved)
}
