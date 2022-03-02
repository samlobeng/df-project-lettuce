
const btnExecute = document.querySelector(".button")
const btnRUN = document.querySelector(".button")
const endpoint = "http://localhost:3001/seedingjob"


// making the table of existing seedingjobs
function draw(t){
    const table = document.getElementById('myTable')
    for (let i=0;i<t.length;i++){
        const row = `<tr>
                <td><input type="radio" class="class_radio" name="checker""></input></td>
                <td>${t[i]._id}</td>
                <td>${t[i].top_left}</td>
                <td>${t[i].bottom_right}</td>
                <td>${t[i].density}</td>
                <td>${t[i].depth}</td>
                </tr>`
        table.innerHTML+= row
    }
}

function updateTable() {
    $("#myTable tr").remove();
    $.ajax({
        type: "GET",
        url: endpoint,
        dataType: "json",
        async: true,
        success: function () {
            loadTable()
        }
    });
}


function loadTable(){
    fetch(endpoint)
        .then((response)=>{return response.json();})
        .then((myJson)=>{
            draw(myJson)
        })
}


function select_row() {
    const radios = document.getElementsByName("checker")
    for (let i = 0;i<radios.length;i++){
        if (radios[i].checked == true){
            // const row = radios[i].parentNode.parentNode.textContent
            const selected_job_ID = radios[i].parentNode.parentNode.children[1].textContent
            alert('selected_job_ID:' + selected_job_ID);
        }
    }
}


// load records on load
window.onload = function(){
    loadTable()
}


//Runs when we press the save button
const handleSubmit = async (event) =>{
    event.preventDefault()

    //getting data from the form and make data onject
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
        if(response.ok) {
            console.log(response.body);
            updateTable()

        }

    }
    catch  (error){

    }
}

////////////////handleRUN to run seeding job
const handleRUN = async (event) => {

    select_row()

    //EDIT THIS to call for SEEDING FUNCTION



}


btnExecute.addEventListener("click", handleSubmit)
btnRUN.addEventListener("click", handleRUN)





