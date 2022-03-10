function milliliterTomilliseconds(ml){
    return (ml/58.0)*1000
}



////default watering date
function dateGenerator(){
    let date = new Date()
    console.log(date)
    document.getElementById("starting_date").innerHTML = date.toLocaleTimeString();

    // document.write(new Date().toLocaleDateString())
}
