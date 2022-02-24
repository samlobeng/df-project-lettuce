
const btnExecute = document.querySelector(".button")
const endpoint = "http://localhost:3001/seedingjob"

function draw() {
    var canvas = document.getElementById('tutorial');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
    }
}

const handleSubmit = async (event) =>{
    event.preventDefault()

    const myData = {
        top_left: [parseInt(document.getElementById("tl-x").value), parseInt(document.getElementById("tl-y").value)],
        bottom_right: [parseInt(document.getElementById("br-x").value), parseInt(document.getElementById("br-y").value)],
        density: parseInt(document.getElementById("density").value),
        depth: parseInt(document.getElementById("depth").value)
    }

    try {
    const response = await fetch(endpoint,{
        method: "POST",
        body: JSON.stringify(myData),
        headers:{
            "Content-type": "application/json",
        },
    })
        if(response.ok){
            const data = await response.json()
           console.log(data)
        }

    }
    catch  (error){

    }
}

btnExecute.addEventListener("click", handleSubmit)
