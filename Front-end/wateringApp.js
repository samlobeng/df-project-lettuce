const btnExecute = document.querySelector(".button")
const btnDelete = document.querySelector(".deleteButton")
const endpoint = "http://localhost:3001/wateringjob"

function getDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    if(dd<10) {
        dd = '0'+dd
    }
    if(mm<10) {
        mm = '0'+mm
    }
    today = yyyy + '-' + dd + '-' + mm;
    console.log(today);
    document.getElementById("date_picker").value = today;
}

//draws the table of watering jobs
function drawWatering(t){
    $("#wateringTable").empty();
    const table = document.getElementById('wateringTable')
    for (let i=0;i<t.length;i++){
        const date = new Date(t[i].createdAt)
        const row = `<tr>
                <td><input type="radio" class="class_radio" name="checker""></td>
<!--                <td>${t[i]._id}</td>-->
                <td>${t[i].plant_type}</td>
                <td>${t[i].top_left}</td>
                <td>${t[i].bottom_right}</td>
                <td>${t[i].density}</td>
                <td>${t[i].depth}</td>
                <td>${date.toLocaleString("de-DE")}</td>
                <td><input type="button" value="${t[i].status}"></td>
                </tr>`
        table.innerHTML+= row
    }
}



//loads data from database
function loadTable(){
    fetch(endpoint)
        .then((response)=>{return response.json();})
        .then((myJson)=>{
            drawWatering(myJson)
        })
}


function updateTable() {
    loadTable()
}



window.onload = function() {
    getDate();
    loadTable()
};



function runWatering(){
    console.log('watering')
}

//run watering function in a given interval
// setInterval(runWatering, 10000);


//Runs when we press the save button
const handlewateringSubmit = async (event) => {
    event.preventDefault()
    //getting data from the form and make data onject
    const myData = {
        plant_type: document.getElementById("plant-type-input").value,
        starting_date: document.getElementById("date_picker").value,
        starting_time: document.getElementById("watering_time").value,
        interval: document.getElementById("watering_interval").value,
        amount: parseInt(document.getElementById("water-amount").value),
        height: parseInt(document.getElementById("height").value),
    }

    console.log(myData)

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(myData),
            headers: {
                "Content-type": "application/json",
            },
        })
        if (response.ok) {
            console.log(response.body);
            updateTable()

        }

    } catch (error) {

    }
}




btnExecute.addEventListener("click", handlewateringSubmit)
// btnDelete.addEventListener('click', handleDelete)
