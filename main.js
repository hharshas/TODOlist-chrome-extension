const firebaseConfig = {
    apiKey: "AIzaSyBBQjLHxpCDt-Dwl9F2PNes_QG3p5Mn2BE",
    authDomain: "ext-auth-35f3b.firebaseapp.com",
    projectId: "ext-auth-35f3b",
    storageBucket: "ext-auth-35f3b.appspot.com",
    messagingSenderId: "882187644741",
    appId: "1:882187644741:web:76931cf7394404f743582c"
};



// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    firebase.auth();
}
catch (e) {
    console.log(e);
}


function load() {


    //get Elements
    let addBtn = document.getElementById('addBtn');
    let selectElem = document.getElementById("categoryFilter");
    let todoList = [];
    let alarmList = [];
    let tempTodoList;
    let dateInput = document.getElementById('dateInput');
    let timeInput = document.getElementById('timeInput');
    let InputElem = document.getElementsByTagName("input")[0];
    let InputElem2 = document.getElementsByTagName("select")[0];
    let sortBtn = document.getElementById('sortBtn');
    let downloadBtn = document.getElementById('downloadBtn');
    var calendar;
    let shortListBtn = document.getElementById('shortListBtn');
    let todoTable = document.getElementById('tbody');   // important
    let draggingElement;

    let visitLink = document.getElementById('visitLink');
    let elmNote = document.getElementById("linkNote");
    let settingBtn = document.getElementById('settingBtn');




    chrome.storage.sync.get('todoList', function (data) {
        tempTodoList = data.todoList; //[object Object]
        console.log(data.todoList);


        // clog(todoList.type)
        if (tempTodoList == undefined) {
            tempTodoList = "";
        } else {
            todoList = JSON.parse(tempTodoList);
        }


        console.log(todoList);

        //popup size


        let sizeElem = document.getElementById('popup-size');
        sizeElem.style.width = `${localStorage['width']}px`;
        sizeElem.style.height = `${localStorage['hieght']}px`;



        //toast
        function showToast() {
            const toast = document.getElementById('toast_div');
            toast.classList.remove('hidden');
            setTimeout(function () {
                toast.classList.add('hidden');

            }, 3000)
        }
        function showToast2() {
            const toast2 = document.getElementById('toast_div2');
            toast2.classList.remove('hidden');
            setTimeout(function () {
                toast2.classList.add('hidden');

            }, 3000)
        }

        //Auth state change
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                document.getElementById('showEmail').innerHTML = user.email;
                document.getElementById('toast').innerHTML = "Logged In As :" + "  " + user.email;

                showToast();
            } else {
                document.getElementById('toast2').innerHTML = "User is not defined";
                showToast2();

            }
        });

        //---todo---





        //starting function


        function save() {
            let stringified = JSON.stringify(todoList)
            // localStorage.setItem("todoList", stringified);

            chrome.storage.sync.set({ "todoList": stringified }, function () {
            });

        }
        let arr = [];




        //defining function
        function addEntry(event) {

            //taking input value
            let inpValue = InputElem.value;
            let inpValue2 = InputElem2.value;
            let dateValue = dateInput.value;
            let timeValue = timeInput.value;

            if (inpValue, inpValue2, dateValue, timeValue == "") {

                document.getElementById('toast2').innerHTML = "Please Fill All Input";
                showToast2();
            } else {

                InputElem.value = "";
                dateInput.value = "";
                timeInput.value = "";

                let randomUUId = _uuid();

                todoList.push({
                    todo: inpValue,
                    category: inpValue2,
                    id: randomUUId,
                    date: dateValue,
                    time: timeValue,
                    done: false,
                    alarm: false,
                    link: " insert valid link here!!!",
                });

                renderRow(inpValue, inpValue2, randomUUId, dateValue, timeValue);
                save();
                multipleFilter();
                console.log(todoList);

            }
        };

        function filterEnteries() {
            clearTable();
            if (selectElem.value == "") {
                todoList.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done));
            } else {
                todoList.forEach(obj => {
                    if (obj.category == selectElem.value) {
                        renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done);
                    }
                })
            }
        }


        function renderRow(inpValue, inpValue2, id, date, time, done, alarm, link) {


            //add a new row
            let table = document.getElementById('tbody');
            let trElem = document.createElement('tr');
            trElem.style.height = '40px'
            table.appendChild(trElem);
            trElem.draggable = "true";
            trElem.dataset.id = id;

            //checkbox cell
            let checkboxElem = document.createElement('input');
            checkboxElem.type = "checkbox";
            checkboxElem.addEventListener("click", checkboxClickCallback);
            //set id
            checkboxElem.dataset.id = id;

            let tdElem1 = document.createElement('td');
            tdElem1.appendChild(checkboxElem);
            trElem.appendChild(tdElem1);

            //date cell
            let dateElem = document.createElement('td');

            dateElem.innerText = formatDate(date);
            trElem.appendChild(dateElem);

            //time cell
            let timeElem = document.createElement('td');
            timeElem.innerText = time;
            trElem.appendChild(timeElem);

            //todo cell
            let tdElem2 = document.createElement('td');
            tdElem2.innerText = inpValue;
            trElem.appendChild(tdElem2);


            //priority cell
            let tdElem3 = document.createElement('td');
            tdElem3.innerText = inpValue2;
            tdElem3.className = "priorityCell";
            trElem.appendChild(tdElem3);


            //google-icon 

            //edit

            let iElem4 = document.createElement("i");
            iElem4.innerText = "edit";
            iElem4.classList = "material-icons";
            iElem4.addEventListener("click", onTableClicked);
            iElem4.dataset.id = id;


            //dustbin
            let iElem = document.createElement("i");
            iElem.innerText = "delete";
            iElem.classList = "material-icons";
            iElem.addEventListener("click", deleteItem);
            iElem.dataset.id = id;

            //alarm
            let iElem2 = document.createElement("i");
            iElem2.innerText = "timer";
            iElem2.classList = "material-icons";

            if (alarm == true) {
                iElem2.classList.add("alarmOn");
            } else {
                iElem2.classList.add("alarmOff");
            };
            iElem2.addEventListener("click", setAlarm);

            iElem2.dataset.id = id;

            //addLink
            let iElem3 = document.createElement("i");
            iElem3.innerText = "attachment";
            iElem3.classList = "material-icons";

            iElem3.addEventListener("click", displayLink);
            iElem3.dataset.id = id;

            //edit&& delete && alarm && addLink cell

            let tdElem7 = document.createElement('td');
            tdElem7.appendChild(iElem4);
            trElem.appendChild(tdElem7);

            let tdElem4 = document.createElement('td');
            tdElem4.appendChild(iElem);
            trElem.appendChild(tdElem4);

            let tdElem5 = document.createElement('td');
            tdElem5.appendChild(iElem2);
            trElem.appendChild(tdElem5);

            let tdElem6 = document.createElement('td');
            tdElem6.appendChild(iElem3);
            trElem.appendChild(tdElem6);

            //toast
            document.getElementById('toast').innerText = inpValue + " Todo is added";
            showToast();


            //check-done
            checkboxElem.checked = done;
            if (done) {
                trElem.classList.add("strike");
                addEvent({                //add to calendar
                    id: id,
                    title: inpValue,
                    start: date,
                    color: 'red',
                });
            } else {
                trElem.classList.remove("strike");
                addEvent({               //add to calendar
                    id: id,
                    title: inpValue,
                    start: date,
                    color: 'blue-500',
                });
            }

            //edit on the cell
            dateElem.dataset.editable = true;
            timeElem.dataset.editable = true;
            tdElem2.dataset.editable = true;
            tdElem3.dataset.editable = true;

            dateElem.dataset.type = "date";
            dateElem.dataset.value = date;
            timeElem.dataset.type = "time";
            tdElem2.dataset.type = "todo";    //09-03-2023//
            tdElem3.dataset.type = "category";

            dateElem.dataset.id = id;
            timeElem.dataset.id = id;
            tdElem2.dataset.id = id
            tdElem3.dataset.id = id
            //tdElem2.addEventListener('dblclick',allowEdit);

            chrome.action.setBadgeText({ text: `${todoList.length}` }, () => { });
            chrome.action.setBadgeBackgroundColor({ color: 'teal' }, () => { })

            function deleteItem() {
                //table remove
                trElem.remove();

                //todolist remove
                for (let i = 0; i < todoList.length; i++) {
                    if (todoList[i].id == this.dataset.id) {
                        document.getElementById('toast2').innerText = todoList[i].todo + " is deleted";
                        showToast2();

                        todoList.splice(i, 1);

                    }
                }
                console.log(todoList);
                save();




                //remove from calendar
                calendar.getEventById(this.dataset.id).remove();

                chrome.action.setBadgeText({ text: `${todoList.length}` }, () => { });
                chrome.action.setBadgeBackgroundColor({ color: 'teal' }, () => { })
            }

            function checkboxClickCallback() {
                trElem.classList.toggle("strike");
                for (let i = 0; i < todoList.length; i++) {
                    if (todoList[i].id == this.dataset.id) {
                        todoList[i].done = this.checked;  //arr elem [key] = true

                        calendar.getEvents().forEach(event => {
                            if (event.id == this.dataset.id) {
                                event.remove();

                                if (this.checked) {
                                    addEvent({                //add to calendar
                                        id: this.dataset.id,
                                        title: todoList[i].todo,
                                        start: todoList[i].date,
                                        color: 'red',
                                    });
                                } else {
                                    addEvent({               //add to calendar
                                        id: this.dataset.id,
                                        title: todoList[i].todo,
                                        start: todoList[i].date,
                                        color: 'blue-500',
                                    });
                                }

                            }
                        });
                    }
                }

                save();
            }




            // function editTask() {

            // }
        }

        function renderRows() {


            todoList.forEach(todoObj => {

                let todoEntry = todoObj.todo;   //key=todo

                console.log('play');
                let todoCategory = todoObj.category;
                let todoId = todoObj.id;
                let todoDone = todoObj.done;
                let todoDate = todoObj.date;
                let todoTime = todoObj.time;
                let todoAlarm = todoObj.alarm;
                let todoLink = todoObj.link;

                renderRow(todoEntry, todoCategory, todoId, todoDate, todoTime, todoDone, todoAlarm, todoLink);

            })
        }

        //Link holder ----

        let index = 0;
        function displayLink() {
            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id == this.dataset.id) {

                    elmNote.value = todoList[i].link;
                    index = i;
                    console.log(index);
                }
            }
        }
        function onSaveLink() {
            console.log(index);
            todoList[index].link = elmNote.value;

            //toast
            document.getElementById('toast').innerText = "New Link is added";
            showToast();

            console.log(todoList);

            save();
        }
        function onVisitLink() {
            chrome.tabs.create({
                url: elmNote.value
            });
        };

        //------- AlarmSystem

        function setAlarm() {

            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id == this.dataset.id) {

                    let alarm_id = todoList[i].id;
                    console.log(alarm_id);


                    if (todoList[i].alarm == false) {

                        console.log('working');
                        console.log(todoList[i].alarm);

                        let alarmTimeInput = `${todoList[i].date} ${todoList[i].time}`
                        console.log(alarmTimeInput);
                        let alarmTimeValue = new Date(alarmTimeInput);
                        let now = new Date();

                        let alarmTime = alarmTimeValue - now;
                        console.log(alarmTime);
                        const minutes = (alarmTime / (1000 * 60));
                        console.log(minutes);

                        // chrome.runtime.onInstalled.addListener(() => {
                        chrome.alarms.create(
                            alarm_id,
                            {
                                delayInMinutes: minutes,
                                // periodInMinutes: 1
                            }
                        );
                        alarmList.push({
                            todo: todoList[i].todo,
                            date: alarmTimeInput,
                            category: todoList[i].category,
                            done: todoList[i].done,
                            link: todoList[i].link,

                        });

                        document.getElementById('toast').innerText = "Alarm created on " + todoList[i].date + " at " + todoList[i].time + " is added";
                        showToast();

                        todoList[i].alarm = true;

                        this.classList.add("alarmOn");
                        this.classList.remove("alarmOff");


                        // });
                    } else {
                        console.log('working2');
                        todoList[i].alarm = false;
                        chrome.alarms.clear(alarm_id);

                        for (j = 0; j < alarmList.length; j++) {
                            if (alarmList[j].todo == todoList[i].todo) {
                                alarmList.splice(j, 1);
                                document.getElementById('toast2').innerText = "Alarm on " + todoList[i].date + " at " + todoList[i].time + " is removed";
                                showToast2();
                            };
                        }


                        this.classList.add("alarmOff");
                        this.classList.remove("alarmOn");



                    }
                }
                save();
                alarmSave();

                localStorage['alarmList'];
            }

        };

        function alarmSave() {
            let stringified = JSON.stringify(alarmList)
            localStorage.setItem("alarmList", stringified);
        }
        function alarmLoad() {
            let retrieved = localStorage.getItem("alarmList");
            alarmList = JSON.parse(retrieved);  //clog(todoList.type)

            if (alarmList == null)
                alarmList = [];

            console.log(alarmList);

        }


        //uuid----

        function _uuid() {   //stack overflow
            var d = Date.now();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }

        function sortEntry() {
            todoList.sort((a, b) => {
                let aDate = Date.parse(a.date);  //clog
                let bDate = Date.parse(b.date);
                return aDate - bDate; // "-" will convert it into numeric rather string
            });

            save();

            clearTable();
            renderRows();
            filterEnteries();
            shortListBtn.checked = false;
        }

        //----fullCalendar-----

        function initCalendar() {
            var calendarEl = document.getElementById('calendar');
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                initialDate: new Date(),//'2023-03-10',
                headerToolbar: {
                    left: 'prev,next',
                    // center: 'title',timeGridWeek
                    right: 'title'
                },
                events: [],
                eventClick: function (info) {  //eventMouseEnter
                    alert('Event: ' + info.event.title);
                    // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                    // alert('View: ' + info.view.type);

                    console.log(info.event.start);

                    // change the border color just for fun
                    info.el.style.borderColor = '#D8F3DC';
                },
                // eventBackgroundColor: 'blue-500',
                eventBorderColor: 'black',
                eventTextColor: 'white',

                editable: true,
                eventDrop: function (info) {  //eventMouseEnter
                    calendarEventDragged(info.event);

                },
            });
            calendar.render();
        }
        function addEvent(event) {
            calendar.addEvent(event)
        }

        function clearTable() {
            //empty the table and calendar
            let trElems = document.getElementsByTagName("tr");

            for (let i = trElems.length - 1; i > 0; i--) {
                trElems[i].remove();
            }
            calendar.getEvents().forEach(event => event.remove());
        }
        function onShortListChange() {

            clearTable();
            if (shortListBtn.checked) {

                let filteredArray = todoList.filter(obj => obj.done == false);
                filteredArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done));

                filteredArray = todoList.filter(obj => obj.done == true);
                filteredArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done));

            } else {
                todoList.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done));
            }
        }

        function multipleFilter() {
            clearTable();
            if (selectElem.value == "") {

                if (shortListBtn.checked) {

                    let filteredArray = todoList.filter(obj => obj.done == false);
                    filteredArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done, obj.alarm));

                    filteredArray = todoList.filter(obj => obj.done == true);
                    filteredArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done, obj.alarm));

                } else {
                    todoList.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done, obj.alarm));
                }
            } else {
                let filteredCategoryArray = todoList.filter(obj => obj.category == selectElem.value);
                if (shortListBtn.checked) {

                    let filteredIncompleteArray = filteredCategoryArray.filter(obj => obj.done == false);
                    filteredIncompleteArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done, obj.alarm));

                    filteredIncompleteArray = filteredCategoryArray.filter(obj => obj.done == true);
                    filteredIncompleteArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done, obj.alarm));

                } else {
                    filteredCategoryArray.forEach(obj => renderRow(obj.todo, obj.category, obj.id, obj.date, obj.time, obj.done, obj.alarm));
                }

            }
        }




        function onTableClicked(event) {

            event.target.classList.toggle('editOn');

            let bfrTarget = event.target;
            while (!bfrTarget.matches("tr")) {
                bfrTarget = bfrTarget.parentNode;
            };


            if (event.target.classList.contains("editOn")) {

                bfrTarget.classList.add('glow');

                event.target.style.color = '#343A40';
                for (i = 1; i < 4; i++) {
                    let eachTarget = bfrTarget.childNodes[i];
                    if (eachTarget.matches("td") && eachTarget.dataset.editable == "true") {
                        let tempInputElem = document.createElement('input');

                        switch (eachTarget.dataset.type) {
                            case "date":
                                tempInputElem.style.width = '87px';
                                tempInputElem.style.height = '20px';
                                tempInputElem.type = "date";
                                tempInputElem.value = eachTarget.dataset.value;  //cuz innerHtml is in diff formatt better make value dataset
                                break;
                            case "time":
                                tempInputElem.style.width = '63px';
                                tempInputElem.style.height = '20px';
                                tempInputElem.type = "time";
                                tempInputElem.value = eachTarget.innerText;

                                break;
                            case "todo":
                            case 'category':
                                tempInputElem.style.width = '90px';
                                tempInputElem.style.height = '20px';
                                tempInputElem.value = eachTarget.innerText;

                                break;
                            default:
                        }
                        eachTarget.innerText = "";
                        eachTarget.appendChild(tempInputElem);
                        // console.log(edit);
                        console.log('if');



                        // tempInputElem.addEventListener('change', onChange);
                    }
                }

            } else {
                bfrTarget.classList.remove('glow');

                // console.log(edit);
                console.log('else');


                event.target.style.color = 'gray';

                for (i = 1; i < 4; i++) {

                    let eachTarget = bfrTarget.childNodes[i];


                    let changedValue = eachTarget.childNodes[0].value;
                    let id = eachTarget.dataset.id;
                    let type = eachTarget.dataset.type;



                    if (type == "date") {
                        eachTarget.innerText = formatDate(changedValue); //dateElem

                    } else {
                        eachTarget.innerText = changedValue;
                    }


                    calendar.getEventById(id).remove();

                    todoList.forEach(todoObj => {
                        if (todoObj.id == id) {
                            // todoObj.todo = changedValue;
                            todoObj[type] = changedValue;   //todoList

                            if (todoObj.done) {
                                addEvent({                      //calendar
                                    id: id,
                                    title: todoObj.todo,
                                    start: todoObj.date,
                                    color: 'red',
                                });
                            } else {
                                addEvent({                      //calendar
                                    id: id,
                                    title: todoObj.todo,
                                    start: todoObj.date,
                                    color: 'blue-500',
                                })
                            }
                            //updatin datast-value
                        }
                    })


                }
                save();
            }
        }
        // 


        function formatDate(date) {
            let dateObj = new Date(date);
            let formattedDate = dateObj.toLocaleString('en-GB', {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
            return formattedDate;
        }
        function onDragstart(event) {
            console.log(event.target);//trElem
            draggingElement = event.target;//trElem

        }

        function onDrop(event) {
            console.log('drop');

            let beforeTarget = event.target;
            //to look for parents until it's tr;
            while (!beforeTarget.matches("tr")) {
                beforeTarget = beforeTarget.parentNode;
            }
            console.log(beforeTarget);
            // beforeTarget.style.color = 'yellow';
            todoTable.insertBefore(draggingElement, beforeTarget);

            //saving the arrangement in todoList

            let tempIndex;

            //remove
            todoList.forEach((todoObj, index) => {    //forEach((obj,index,arr))
                if (todoObj.id == draggingElement.dataset.id) {
                    tempIndex = index;

                }
            })

            let [toinsertObj] = todoList.splice(tempIndex, 1);  //object destructuring


            //add

            todoList.forEach((todoObj, index) => {    //forEach((obj,index,arr))
                if (todoObj.id == beforeTarget.dataset.id) {
                    tempIndex = index;

                }
            })

            todoList.splice(tempIndex, 0, toinsertObj);
            save();

        }

        function onDragover(event) {
            event.preventDefault();
        }
        function calendarEventDragged(event) {
            let id = event.id;
            let dateObj = event.start;

            let month = dateObj.getMonth() + 1;
            let year = dateObj.getFullYear();
            let date = dateObj.getDate();

            let paddedMonth = month.toString();
            if (paddedMonth.length < 2) {
                paddedMonth = "0" + paddedMonth;
            }
            let paddedDate = date.toString();
            if (paddedDate.length < 2) {
                paddedDate = "0" + paddedDate;
            }

            let toStoreDate = year + "-" + paddedMonth + "-" + paddedDate;

            todoList.forEach(todoObj => {
                if (todoObj.id == id) {
                    todoObj.date = toStoreDate;
                }
            });
            save();
            multipleFilter();  //renderTable
        }

        function onDownloadBtn() {

            var element = document.getElementById('todoTable');
            var opt = {
                margin: 1,
                filename: 'MyToDO.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            }

            html2pdf(element, opt);
        }
        function onSettingBtn() {
            chrome.tabs.create({
                url: "options.html"
            });
        }


        alarmLoad();
        initCalendar();
        renderRows();


        //addListener
        addBtn.addEventListener('click', addEntry);
        selectElem.addEventListener("change", multipleFilter);
        sortBtn.addEventListener('click', sortEntry);
        shortListBtn.addEventListener("change", multipleFilter);
        downloadBtn.addEventListener("click", onDownloadBtn);

        todoTable.addEventListener("dragstart", onDragstart);
        todoTable.addEventListener("drop", onDrop);
        todoTable.addEventListener("dragover", onDragover);//default prevent drop

        visitLink.addEventListener("click", onVisitLink);
        settingBtn.addEventListener('click', onSettingBtn);

        let saveLink = document.getElementById('saveLink');
        saveLink.addEventListener("click", onSaveLink);
    });
}

load();