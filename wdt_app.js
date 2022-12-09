function clock(){
    var date = new Date();
    let t = date.getDate();
    let mo = date.getMonth();
    let y = date.getFullYear();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    m = addZero(m);
    s = addZero(s);
    $("#clock").text(t + '/' + mo + '/' + y + ' ' + h + ':' + m + ':' + s);
    setTimeout(clock, 1000);
}

function addZero(time){
    if(time < 10){
        time = "0" + time;
        return time;
    }
    else{
        return time;
    }
}


class employee{
    constructor(
        name,
        surname
    ){
        this.name = name;
        this.surname = surname 
    }
}

class staffMember extends employee{
    constructor(
        picture,
        name,
        surname,
        email
    ){
        super(name, surname);
        this.picture = picture;
        this.email = email;
        this.status = "In";
        this.outTime = null;
        this.duration = null;
        this.expectedReturnTime = null;
        this.staffInterval = null;
    }  
    staffMemberIsLate(){ 
        let time = parseInt(this.expectedReturnTime.slice(0,2)) * 60 + parseInt(this.expectedReturnTime.slice(-2));
        this.staffInterval = setInterval(() =>{
            var date = new Date();
            let currentTime = date.getHours() * 60 + date.getMinutes();
            if(time < currentTime){
                clearInterval(this.staffInterval);
                $("#toast").append('<div id="staffToastFor' + this.name + '"class="toast" data-bs-autohide="false" role="alert" aria-live="assertive" aria-atomic="true"></div>')
                $("#staffToastFor" + this.name).append('<div id="staffToastHeaderFor' + this.name + '" class="toast-header"></div>')
                $("#staffToastHeaderFor" + this.name).append('<strong class="me-auto">' + '<img src="' + this.picture + '"></img>'  +'</strong>')
                $("#staffToastHeaderFor" + this.name).append('<small>'+ this.name + ' ' + this.surname + ' has been out of the office since ' + this.outTime +'</small>')
                $("#staffToastHeaderFor" + this.name).append('<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>')
                $("#staffToastFor" + this.name).toast("show");
            }   
        }, 1000)
    }
}

class deliveryDriver extends employee{
    constructor(
        vehicle,
        name,
        surname,
        telephone,
        deliveryAddress,
        returnTime
    ){
        super(name, surname);
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliveryAddress = deliveryAddress;
        this.returnTime = returnTime;
    }
    deliveryDriverIsLate(){

    }
}

let staffArray = []
function staffUserGet(){
    $.ajax({
        url: 'https://randomuser.me/api/?results=5',
        success: function(data){
            let APIdata = data.results;
            for(let i = 0; i < APIdata.length; i++){
                staffArray.push(new staffMember(
                    APIdata[i].picture.thumbnail, 
                    APIdata[i].name.first,
                    APIdata[i].name.last,
                    APIdata[i].email,
                ))
            }
            enterTable();
        }
    })
}

function enterTable(){
    for(let i = 0; i < staffArray.length; i++){
        $("#picture" + i).append("<img src='" + staffArray[i].picture + "'></img>");
        $("#name" + i).text(staffArray[i].name);
        $("#surname" + i).text(staffArray[i].surname);
        $("#emailaddress" + i).text(staffArray[i].email);
        $("#status" + i).text(staffArray[i].status);
    }
}

function staffOut(){
    let staffName = prompt("Enter the name and surname of the staff member leaving the office.");
    for(let i = 0; i < staffArray.length; i++){
        if(staffName === staffArray[i].name + " " + staffArray[i].surname){
            let time = parseInt(prompt("Please enter the duration of their absence in minutes"));
            if(time > 0){
                //Duration
                staffArray[i].duration = Math.floor(time/60) + 'hr ' + time%60 + 'mins'
                $("#duration" + i).text(staffArray[i].duration);
                //Status 
                staffArray[i].status = "Out";
                $("#status" + i).text(staffArray[i].status);
                //Out time
                var date = new Date();
                let hours = date.getHours();
                let mins = date.getMinutes();
                hoursAddZero = addZero(hours)
                minsAddZero = addZero(mins);
                staffArray[i].outTime = hoursAddZero + ':' + minsAddZero; 
                $("#outtime" + i).text(staffArray[i].outTime);
                //Expected return time 
                let hourSum = hours + Math.floor(time/60);
                let minSum = mins + time%60;
                timeArray = minsGreaterThan60(minSum, hourSum);
                timeArray[1] = hoursGreaterThan24(timeArray[1]);
                timeArray[0] = addZero(timeArray[0]);
                timeArray[1] = addZero(timeArray[1]);
                staffArray[i].expectedReturnTime = timeArray[1] + ':' + timeArray[0];
                $("#expectedreturntime" + i).text(staffArray[i].expectedReturnTime);
                //StaffMemberIslate 
                staffArray[i].staffMemberIsLate();
                break;
            }
            else{
                alert("Please enter a valid number")
                break;
            }
        }
        else if(staffName !== staffArray[i].name + " " + staffArray[i].surname && i == 4){
            alert("Please enter a valid name and surname. Note that this prompt is case sensitive.")
        }
    }
}
function minsGreaterThan60(mins, hours){
    if(mins >= 60){
        hours++;
        mins = mins-60;
        return [mins, hours];
    }
    else{
        return [mins, hours]; 
    }
}

function hoursGreaterThan24(hour){
    if(hour >= 24){
        hour = hour - 24;
        return hour;
    }
    else{
        return hour;
    }
}

function staffIn(){
    let staffName = prompt("Enter the name and surname of the staff member entering the office.");
    for(let i = 0; i < staffArray.length; i++){
        if(staffName === staffArray[i].name + " " + staffArray[i].surname){
            staffArray[i].status = "In";
            $("#status" + i).text(staffArray[i].status);
            staffArray[i].duration = null;
            $("#duration" + i).text(staffArray[i].duration);
            staffArray[i].outTime = null;
            $("#outtime" + i).text(staffArray[i].outTime);
            staffArray[i].expectedReturnTime = null;
            $("#expectedreturntime" + i).text(staffArray[i].expectedReturnTime);
            clearInterval(staffArray[i].staffInterval);
            break;
        }
        else if(staffName !== staffArray[i].name + " " + staffArray[i].surname && i == 4){
            alert("Please enter a valid name and surname. Note that this prompt is case sensitive.")
        }
    }
}

