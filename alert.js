
function formatted_date() {
    let dateObj = new Date();

    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    let date = dateObj.getDate();
    let hour = dateObj.getHours();
    let minutes = dateObj.getMinutes();

    let paddedMonth = month.toString();
    if (paddedMonth.length < 2) {
        paddedMonth = "0" + paddedMonth;
    }
    let paddedDate = date.toString();
    if (paddedDate.length < 2) {
        paddedDate = "0" + paddedDate;
    }
    let paddedHour = hour.toString();
    if (paddedHour.length < 2) {
        paddedHour = "0" + paddedHour;
    }
    let paddedMinute = minutes.toString();
    if (paddedMinute.length < 2) {
        paddedMinute = "0" + paddedMinute;
    }

    let toStoreDate = year + "-" + paddedMonth + "-" + paddedDate + " " + paddedHour + ":" + paddedMinute;
    return toStoreDate;


}
function load() {
    let retrieved = localStorage.getItem("alarmList");
    alarmList = JSON.parse(retrieved);  //clog(todoList.type)

    if (alarmList == null)
        alarmList = [];
    console.log(alarmList);

}
function playMusic(){
    let audio = new Audio("mixkit-classic-alarm-995.wav");
    audio.play()
}


playMusic();
load();
console.log(formatted_date());

for (i = 0; i < alarmList.length; i++) {
    if (alarmList[i].date == formatted_date()) {
        document.getElementById('tsk').innerText = alarmList[i].todo;
        document.getElementById("dat-tim").innerHTML = alarmList[i].date;
        document.getElementById("prior").innerHTML = alarmList[i].category;
         if(alarmList[i].done){
            document.getElementById("chek").innerText = "Task Done";
         }else{
            document.getElementById("chek").innerText = "Task Not Done";
         };
    };
}
