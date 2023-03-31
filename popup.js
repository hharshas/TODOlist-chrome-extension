// Your web app's Firebase configuration
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






chrome.identity.getProfileUserInfo({ 'accountStatus': 'ANY' }, function (info) {


    console.log(info.id);
    let email_id = info.email;
    email_name = email_id.slice(0, -10)

    document.getElementById('email_id').innerHTML = `<i class="material-icons">
    account_circle
    </i> &nbsp;`+ email_name;
    console.log(email_name);



    let button = document.getElementById('submit');
    button.addEventListener('click', function () {
        window.location = "main.html"
    });



    function login() {
        firebase.auth().signInWithEmailAndPassword(info.email, info.id)
            .then((cred) => {
                console.log(cred.user);
                // localStorage["email"] = cred.user.email;
            }).catch((err) => {
                console.log(err.message);

                if (err.message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
                    signup();
                }
                if (err.message == "A network error (such as timeout, interrupted connection or unreachable host) has occurred.") {
                    document.getElementById('gradLoad').classList.add('hidden');
                    document.getElementById('noNet').classList.remove('hidden');
                }

            });

    }
    console.log("working");

    // signup

    function signup() {

        firebase.auth().createUserWithEmailAndPassword(info.email, info.id)
            .then((cred) => {
                console.log(cred.user);
            }).catch((err) => {
                console.log(err.message)
                document.getElementById('toast2').innerHTML = err.message;
                showToast2();
            });

    }
    console.log("working_signup");

    //state change

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('toast2').innerHTML = `Logged In as ${info.email}`;
            showToast2();
            document.getElementById('loadingDiv').classList.add('hidden');

        } else {
            document.getElementById('loadingDiv').classList.remove('hidden');
            login();

        }
    });


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

            document.getElementById('today_todo').innerHTML = ct;

            document.getElementById('task_done').innerHTML = done;

            document.getElementById('alarms_active').innerHTML = alm;

            document.getElementById('left_todo').innerHTML = todoList.length - done;

        }
    });
    console.log('the user signed out');

    //modal

    function showModal() {
        document.getElementById('modal').classList.remove('hidden');
    }
    function hideModal() {
        document.getElementById('modal').classList.add('hidden');
    }

});