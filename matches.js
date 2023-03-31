

chrome.storage.sync.get('todoList', function (data) {
    let retrieved = data.todoList; //[object Object]
    if (retrieved == undefined) {
        todoList = [];
    } else {

        todoList = JSON.parse(retrieved);
        console.log(todoList);


        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const dt = yyyy + '-' + mm + '-' + dd;


        let ct = 0;
        let done = 0;
        let alm = 0;
        console.log(dt);


        for (let i = 0; i < todoList.length; i++) {

            console.log(todoList[i].date);

            if (todoList[i].date == dt) {
                ct++;
                console.log(ct);

            }
            if (todoList[i].done == true) {
                done++;
            }
            if (todoList[i].alarm == true) {
                alm++;
            }
        }


        function formatDate(date) {
            let dateObj = new Date(date);
            let formattedDate = dateObj.toLocaleString('en-GB', {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
            return formattedDate;
        }

        let div = document.createElement('div');


        div.innerHTML = `<div style = 'display:flex; justify-content:space-around; align-items:center; '>
        
        <span class ='logo'>
        <img style = "height:25px;border-radius:5px; padding:2px;" src='https://i.postimg.cc/W19PWhsW/icon2.webp' border='0' alt='icon2'/>TODOLIST
        </span>
        
        <span class='hover'>
        <span class = 'child1'>
        <span class = 'icon'>${ct}</span>&nbsp;&nbsp;
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check-fill" viewBox="0 0 16 16">
<path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
</svg>&nbsp;<span class='title'>
Task Today ToDo</span></span>
<div class="dropdown-content" >
</div></span>

<span class='hover'>
<span class = 'child1'>
<span class = 'icon'>
${alm}</span>&nbsp;&nbsp;
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
</svg>&nbsp;<span class='title'>
Alarms Active</span></span>
<div class="dropdown-content">
</div></span>
<span class='hover' >
<span class = 'child1'>
<span class = 'icon'>
${done}</span>&nbsp;&nbsp;
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
</svg>&nbsp;<span class='title'>
TaskDone</span></span>
<div class="dropdown-content">
</div></span>
<span class='hover'>
<span class = 'child1'>
<span class = 'icon'>
${todoList.length - done}</span>&nbsp;&nbsp;
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hourglass-split" viewBox="0 0 16 16">
<path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
</svg>&nbsp;
<span class='title'>
Task Left ToDo</span></span>
<div class="dropdown-content";>
</div></span>
<span class='hover' id='closeNavbar'>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>

<div class="dropdown-content";>
</div></span>
</div>`



        let child = document.body.firstChild;
        document.body.insertBefore(div, child);


        div.style.backgroundColor = '#2D2727';
        // div.style.display = 'flex';
        // div.style.justifyContent = "space-around";
        div.style.color = 'aqua';
        // div.style.alignItems = 'center';
        div.style.cursor = 'pointer';
        div.style.padding = '5px';
        div.classList.add('navBar');
        div.style.position = 'relative';
        div.style.zIndex = '9999999999999999999999999999999999999';


        let hoverElm = document.getElementsByClassName('hover');

        for (const key in hoverElm) {
            if (Object.hasOwnProperty.call(hoverElm, key)) {
                const element = hoverElm[key];
                element.addEventListener('mouseover', () => {
                    element.style.color = 'white';
                    element.style.borderColor = '#2D2727';


                    element.lastChild.style.display = 'block';


                });


                element.addEventListener('mouseout', () => {
                    element.style.backgroundColor = '#2D2727';
                    element.style.color = 'aqua';
                    element.lastChild.style.display = 'none';


                });

            }
        }
        let ct1 = 0;
        let ct2 = 0;
        let ct3 = 0;
        let ct4 = 0;

        for (let i = 0; i < todoList.length; i++) {


            if (todoList[i].date == dt) {

                ct1 = ct1 + 1;
                let alist = document.createElement('a');
                alist.style.display = 'grid';
                alist.style.gridTemplateColumns = '1fr 1fr';
                alist.classList.add('sub_div1');
                let todoDiv = document.createElement('div');


                todoDiv.style.backgroundColor = 'teal';
                todoDiv.classList.add('card_div');
                todoDiv.innerHTML = `${ct1}.&nbsp; ${todoList[i].todo}`
                let dtDiv = document.createElement('div');
                dtDiv.innerHTML = `&nbsp;${todoList[i].time}`;
                dtDiv.style.display = 'none';
                dtDiv.style.backgroundColor = 'teal';


                dtDiv.classList.add('card_div');
                dtDiv.style.textAlign = 'center';

                alist.appendChild(todoDiv);
                alist.appendChild(dtDiv);
                document.getElementsByClassName('dropdown-content')[0].appendChild(alist);
            }

            if (todoList[i].done == true) {
                ct2 = ct2 + 1;
                let alist = document.createElement('a');
                alist.style.display = 'grid';
                alist.style.gridTemplateColumns = '1fr 1fr';
                alist.classList.add('sub_div2');
                let todoDiv = document.createElement('div');


                todoDiv.style.backgroundColor = 'teal';
                todoDiv.classList.add('card_div');
                todoDiv.innerHTML = `${ct2}.&nbsp; ${todoList[i].todo}`
                let dtDiv = document.createElement('div');
                dtDiv.innerHTML = `${todoList[i].time}&nbsp;&nbsp;&bull;&nbsp;&nbsp;${formatDate(todoList[i].date)}`;
                dtDiv.style.display = 'none';
                dtDiv.style.textAlign = 'center';
                dtDiv.style.backgroundColor = 'teal';


                dtDiv.classList.add('card_div');

                alist.appendChild(todoDiv);
                alist.appendChild(dtDiv);
                document.getElementsByClassName('dropdown-content')[2].appendChild(alist);
            } else {
                ct4++;
                let alist = document.createElement('a');
                alist.style.display = 'grid';
                alist.style.gridTemplateColumns = '1fr 1fr';
                alist.classList.add('sub_div4');
                let todoDiv = document.createElement('div');


                todoDiv.style.backgroundColor = 'teal';
                todoDiv.classList.add('card_div');
                todoDiv.innerHTML = `${ct4}.&nbsp; ${todoList[i].todo}`
                let dtDiv = document.createElement('div');
                dtDiv.innerHTML = `${todoList[i].time}&nbsp&nbsp;&bull;&nbsp;&nbsp;${formatDate(todoList[i].date)}`;
                dtDiv.style.display = 'none';
                dtDiv.style.textAlign = 'center';
                dtDiv.style.backgroundColor = 'teal';


                dtDiv.classList.add('card_div');

                alist.appendChild(todoDiv);
                alist.appendChild(dtDiv);
                document.getElementsByClassName('dropdown-content')[3].appendChild(alist);
            }
            if (todoList[i].alarm == true) {
                ct3++;

                let alist = document.createElement('a');
                alist.style.display = 'grid';
                alist.style.gridTemplateColumns = '1fr 1fr';
                alist.classList.add('sub_div3');
                let todoDiv = document.createElement('div');


                todoDiv.style.backgroundColor = 'teal';
                todoDiv.classList.add('card_div');
                todoDiv.innerHTML = `${ct3}.&nbsp; ${todoList[i].todo}`
                let dtDiv = document.createElement('div');
                dtDiv.innerHTML = `${todoList[i].time}&nbsp;&nbsp;&bull;&nbsp;&nbsp;${formatDate(todoList[i].date)}`;
                dtDiv.style.display = 'none';
                dtDiv.style.textAlign = 'center';
                dtDiv.style.backgroundColor = 'teal';


                dtDiv.classList.add('card_div');

                alist.appendChild(todoDiv);
                alist.appendChild(dtDiv);
                document.getElementsByClassName('dropdown-content')[1].appendChild(alist);
            }
        }
        for (let i = 1; i <= 4; i++) {
            let sub_div = document.getElementsByClassName(`sub_div${i}`);

            for (const key in sub_div) {
                if (Object.hasOwnProperty.call(sub_div, key)) {
                    const element = sub_div[key];
                    element.addEventListener('mouseover', () => {
                        element.lastChild.style.display = 'block';


                    });
                    element.addEventListener('mouseout', () => {
                        element.lastChild.style.display = 'none';


                    });

                }
            }



        }
        document.getElementById('closeNavbar').addEventListener('click',()=>{
            document.getElementsByClassName('navBar')[0].style.display = 'none';
 
        });
    }
});



