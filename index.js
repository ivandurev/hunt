var token = "randomtoken"; // User token
var username = "";

function checkToken()
{
    if(localStorage.getItem('token')!=undefined && localStorage.getItem('token')!='undefined')
    {
        token = localStorage.getItem('token');
    }
    var request = new XMLHttpRequest();
    request.open("POST","checkToken/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            var resp = JSON.parse(request.responseText);
            console.log(resp);
            if(!resp.valid)
            {
                token = resp.ntk;
                localStorage.setItem('token', token);
            }
        }
    }
}

function checkLogin(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","checkLogin/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function login(user, pass, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","login/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("user="+encodeURIComponent(user)+"&pass="+encodeURIComponent(pass)+"&token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
		 	{
				console.log(request.responseText);
				return;
			}
            callback(JSON.parse(request.responseText));
        }
    }
    return 0;
}
function getRequests(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getRequests/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function register(user, pass, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","register/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("user="+encodeURIComponent(user)+"&pass="+encodeURIComponent(pass)+"&token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function allowUser(username, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","allowUser/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function denyUser(username, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","denyUser/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("username="+encodeURIComponent(username)+"&token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getGameStats(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getGameStats/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}

function removeUser(username, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","removeUser/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&username="+encodeURIComponent(username));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}

function setPrivilege(username, type, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","setPrivilege/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&username="+encodeURIComponent(username)+"&type="+encodeURIComponent(type));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getGames(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getGames/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined)
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}

function createGame(riddles, flags, callback)
{
    var rn = "";
    for(var i = 0; i < riddles.length; i ++)
    {
        rn += String(riddles[i]);
        rn += "_";
    }
    var request = new XMLHttpRequest();
    request.open("POST","createGame/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&riddles="+encodeURIComponent(rn)+"&flags="+encodeURIComponent(flags));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
		 	{
				console.log(request.responseText);
				return;
			}
            callback(JSON.parse(request.responseText));
        }
    }
}
function createRiddle(loc1, loc2, riddle, hint, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","createRiddle/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&loc1="+encodeURIComponent(loc1)+"&loc2="+encodeURIComponent(loc2)+"&riddle="+encodeURIComponent(riddle)+"&hint="+encodeURIComponent(hint));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
		 	{
				console.log(request.responseText);
				return;
			}
            callback(JSON.parse(request.responseText));
        }
    }
}
function joinGame(id, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","joinGame/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&gameID="+encodeURIComponent(id));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
		 	{
				console.log(request.responseText);
				return;
			}
            callback(JSON.parse(request.responseText));
        }
    }
}
function changeGame(ngame, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","changeGame/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&ngame="+encodeURIComponent(ngame));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getMyCreatedGames(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getMyCreatedGames/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}

function getRiddle(riddleID, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getRiddle/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&riddleID="+encodeURIComponent(riddleID));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getRiddles(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getRiddles/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getUserType(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getUserType/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getCurrRiddle(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getCurrRiddle/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getStatus(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getStatus/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}

function getHint(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getHint/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getPendingReviews(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getPendingReviews/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function getUsername(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","getUsername/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function hostGame(gameID, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","hostGame/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&gameID="+encodeURIComponent(gameID));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function setReview(username, gr, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","setReview/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&username="+encodeURIComponent(username)+"&complete="+encodeURIComponent(gr));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function uploadPicture(domid, callback)
{
    var fileInput = document.getElementById(domid);
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    console.log(formData);


    var request = new XMLHttpRequest();
    request.open("POST","uploadPicture/",true);
    //request.setRequestHeader("Content-Type", "multipart/form-data");
    request.send(formData);
}
function joinPublicGame(callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","joinPublicGame/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}
function checkLocation(loc1, loc2, callback)
{
    var request = new XMLHttpRequest();
    request.open("POST","checkLocation/",true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send("token="+encodeURIComponent(token)+"&loc1="+encodeURIComponent(loc1)+"&loc2="+encodeURIComponent(loc2));
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            if(callback == undefined) 
            {
                console.log(request.responseText);
                return;
            }
            callback(JSON.parse(request.responseText));
        }
    }
}

function reset()
{
    localStorage.setItem('token',undefined);
}

checkToken();
checkLogin(function(r)
{
    console.log(r);
    if(r.logged == 0 && window.location.pathname != "/loginpage.html") window.location = "loginpage.html";
});




function onLogin() {
    var username = document.getElementById("un").value;
    var password = document.getElementById("pw").value;
    login(username, password, function(args) {
    if(args.ok) {
        window.location = "allGames.html";
    } else {
        document.getElementById("error").removeAttribute("hidden");
    }
    });
}

function onRegister() {
    var username = document.getElementById("un").value;
    var password = document.getElementById("pw").value;
    register(username, password, function(args) {
    if(args.ok) {
        window.location = "dashboard.html";
    } else {
        document.getElementById("error").removeAttribute("hidden");
    }
    });
}

function onJoin() {
    var gameID = document.getElementById("gameId").value;
    joinGame(gameID, function(args) {
    if(args.ok == 1) {
        window.location = "currentGame.html";
    }
    if(args.ok == 0) {
        document.getElementById("error").innerHTML = "Cannot join game!";
    }
    if(args.ok == -1) {
        document.getElementById("error").innerHTML = "This game does not exist!";
    }
    if(args.ok == -2) {
        document.getElementById("error").innerHTML = "You are already in this game!";
    }
    if(args.ok == -3) {
        document.getElementById("error").innerHTML = "You have alreday requested to join this game!";
    }
    document.getElementById("error").removeAttribute("hidden");
    });
}

function onJoinPublic() {
    joinPublicGame();
}

function openReviewPopup(name, image) {
    document.getElementById("id01").style.display = "block";
    document.getElementById("popuptitle").innerHTML = "Review";
    var popup = "<img src='" + image + "'>";
    popup += "<input type='button' class='reviewButton' id='accept' value='Confirm' onclick='setReview(&quot;" + name + "&quot;, 1, function(args) { alert(&quot;User " + name + " accepted!&quot;); })'>";
    popup += "<br><input type='button' class='reviewButton' id='reject' value='Deny' onclick='setReview(&quot;" + name + "&quot;, 0, function(args) { alert(&quot;User " + name + " rejected!&quot;); })'>";
    document.getElementById("popup").innerHTML = popup;
}

function showHint() {
    getHint(function(args) {
    document.getElementById("id01").style.display = "block";
    document.getElementById("popuptitle").innerHTML = "Hint";
    document.getElementById("popup").innerHTML = args.hint;
    });
}

function loadCurrentGame() {
    getUserType(function(args) {
    if(args.resp == -1) {
        document.getElementById("nocurrtxt").removeAttribute("hidden");
        //document.getElementById("content2").innerHTML = "You are not currently in any game!";
    }
    if(args.resp == 0) {
        document.getElementById("admin").removeAttribute("hidden");
        document.getElementById("reviewer").removeAttribute("hidden");
        getRequests(function(args) {
        var requests = "";
        for(i = 0; i < args.length; i ++) {
            requests += "<tr><td>" + args[i] + "</td><td><input type='button' class='reviewButton' value='Allow' onclick=allowUser('" + args[i] + "',function(args){loadCurrentGame();})></td><td><input value='Deny' class='reviewButton' type='button' onclick=denyUser('" + args[i] + "',function(args){loadCurrentGame();})></td></tr>";
        }
        document.getElementById("requests").innerHTML = requests;
        document.getElementById("requests").removeAttribute("hidden");
        });
        getGameStats(function(args) {
        var gameStats = "";
        for(i = 0; i < args.length; i ++) {
            if(args[i].type == 0) continue;
            gameStats += "<tr><td>" + args[i].username + "</td><td>";
            if(args[i].type == 1) {
            gameStats += "REVIEWER</td><td><select class='mdb-select mdb-form' onchange=setPrivilege('" + args[i].username + "',2) ><option selected>Reviewer</option><option>Participant</option></select></td><td>";
            }
            if(args[i].type == 2) {
            gameStats += args[i].on + "</td><td><select class='mdb-select mdb-form'  onchange=setPrivilege('" + args[i].username + "',1) ><option>Reviewer</option><option selected>Participant</option></select></td><td>";
            }
            gameStats += "<i class='fa fa-trash' onclick=removeUser('" + args[i].username + "',function(){loadCurrentGame();});></i></td></tr>";
        }
        document.getElementById("gameStatistics").innerHTML = gameStats;
        document.getElementById("gameStatistics").removeAttribute("hidden");
        console.log(gameStats);
        });
        getPendingReviews(function(args) {
        var pendReviews = "";
        for(i = 0; i < args.length; i ++) {
            pendReviews += "<tr><td>" + args[i].username + "</td><td><button class='reviewButton' onclick=openReviewPopup('" + args[i].username + "','" + args[i].imgURL + "')>Review</button></td></tr>";
        }
        document.getElementById("pendingReviews").innerHTML = pendReviews;
        document.getElementById("pendingReviews").removeAttribute("hidden");
        });     
    }
    if(args.resp == 1) {

        document.getElementById("reviewer").removeAttribute("hidden");
        getPendingReviews(function(args) {
        var pendReviews = "";
        for(i = 0; i < args.length; i ++) {
            pendReviews += "<tr><td>" + args[i].username + "</td><td><button class='reviewButton' onclick=openReviewPopup('" + args[i].username + "','" + args[i].imgURL + "')>Review</button></td></tr>";
        }
        document.getElementById("pendingReviews").innerHTML = pendReviews;
        document.getElementById("pendingReviews").removeAttribute("hidden");
        });
    }
    if(args.resp == 2) {
        document.getElementById("participantd").removeAttribute("hidden");
        getCurrRiddle(function(args) {
        document.getElementById("currGameId").innerHTML = args.gameID;
        document.getElementById("content2").innerHTML = args.content;
        document.getElementById("completedRiddles").innerHTML = args.on + 1;
        document.getElementById("hintButton").removeAttribute("hidden");


        document.getElementById("currGameId").removeAttribute("hidden");
        document.getElementById("content2").removeAttribute("hidden");
        document.getElementById("completedRiddles").removeAttribute("hidden");
        document.getElementById("hintButton").removeAttribute("hidden");
        });
        getStatus(function(args) {
        if(args.status == -2) {
            document.getElementById("statusMessage").innerHTML = "Your picture was not approved. Send another...";
        }
        if(args.status == -1) {
            document.getElementById("statusMessage").innerHTML = "Not there yet...";
        }
        if(args.status == 0) {
            document.getElementById("statusMessage").innerHTML = "You're here! Just send a picture now...";
        }
        if(args.status == 1) {
            document.getElementById("statusMessage").innerHTML = "Your picture review is pending...";
        }

        document.getElementById("statusMessage").removeAttribute("hidden");
        });
    }
    });
}
function logout()
{
    token = "random";
    window.location = "loginpage.html";
}

function allGames() {
    getGames(function(args) {
    var games = "";
    for(i = 0; i < args.length; i ++) {
        var type;
        if(args[i].type == 0) type = "admin";
        if(args[i].type == 1) type = "reviewer";
        if(args[i].type == 2) type = "participant";
        games += "<tr><td>" + args[i].gameID + "</td><td>" + type + "</td><td><button class='reviewButton' onclick=changeGame('" + args[i].gameID + "',function(args){window.location='currentGame.html'})>Select game</button></td></tr>";
    }
    document.getElementById("games").innerHTML = games;
    });
}

function submitGame() {
    var riddleList = document.getElementById("riddleList").value;
    var riddleList = "var inst = [" + riddleList + "]";
    eval(riddleList);
    createGame(inst, "lp", function(args) {
    if(args.ok == 0) {
        document.getElementById("error").innerHTML = "Something went wrong!";
        document.getElementById("error").removeAttribute("hidden");
    }
    if(args.ok == 1) {
        hostGame(args.id);
    }
    });
}

function submitRiddle() {
    var loc_1 = parseFloat(document.getElementById("loc1").value) * 1000000;
    var loc_2 = parseFloat(document.getElementById("loc2").value) * 1000000;
    var text = document.getElementById("content2").value;
    var hint = document.getElementById("hint2").value;
    createRiddle(loc_1, loc_2, text, hint);
    uploadPicture("file2");
    loadCreateGame();
}

function loadCreateGame() {
    getRiddles(function(args) {
    var riddles = "";
    for(i = 0; i < args.length; i ++)
    {
        riddles += "<tr><td>" + args[i].id + "</td><td>" + args[i].riddle.substring(0, 20) + "...</td><td>" + args[i].hint.substring(0, 20) + "...</td></tr>";
    
    }
    document.getElementById("riddles").innerHTML = riddles;
    });
}

function showPosition(position) {
    console.log("hello");
    var lati = position.coords.latitude;
    var longi = position.coords.longitude;
    lati *= 1000000;
    longi *= 1000000;
    lati = Math.floor(lati);
    longi = Math.floor(longi);
    console.log(lati, longi);
    checkLocation(lati, longi, function()
    {
        loadCurrentGame();
    });

}

function onCheckLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
    //setTimeout(checkLocationLoop, 2000);
}


getUsername(function(args)
{
    document.getElementById("userName").innerHTML = args.user;
});