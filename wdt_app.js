function clock(){
    $(document).ready(function(){
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
    })
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
        this.deliveryInterval = null;
    }
    deliveryDriverIsLate(){
        let time = parseInt(this.returnTime.slice(0,2)) * 60 + parseInt(this.returnTime.slice(-2));
        this.deliveryInterval = setInterval(() =>{
            var date = new Date();
            let currentTime = date.getHours() * 60 + date.getMinutes();
            if(time < currentTime){
                clearInterval(this.deliveryInterval);
                $("#toast").append('<div id="deliveryToastFor' + this.name + '"class="toast" data-bs-autohide="false" role="alert" aria-live="assertive" aria-atomic="true"></div>')
                $("#deliveryToastFor" + this.name).append('<div id="deliveryToastHeaderFor' + this.name + '" class="toast-header"></div>')
                $("#deliveryToastHeaderFor" + this.name).append('<small>'+ this.name + ' ' + this.surname + '\'s delivery was expected at ' + this.returnTime + ' from ' + this.deliveryAddress + ', their phone number is ' + this.telephone + '</small>')
                $("#deliveryToastHeaderFor" + this.name).append('<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>')
                $("#deliveryToastFor" + this.name).toast("show");
            }
        }, 1000)
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

$(document).ready(function(){
    $('#staffTable').on('mousedown', 'tr', function() {
    $(this).toggleClass('selected').siblings().removeClass('selected');;
    })
})

function staffOut(){
    let id = $(".selected").attr('id');
    if(id != undefined){
        let i = id.slice(-1);
        let time = parseInt(prompt("Please enter the duration of their absence in minutes"));
        if(time > 0){
            staffArray[i].duration = Math.floor(time/60) + 'hr ' + time%60 + 'mins'
            $("#duration" + i).text(staffArray[i].duration);
            staffArray[i].status = "Out";
            $("#status" + i).text(staffArray[i].status);
            var date = new Date();
            let hours = date.getHours();
            let mins = date.getMinutes();
            hoursAddZero = addZero(hours)
            minsAddZero = addZero(mins);
            staffArray[i].outTime = hoursAddZero + ':' + minsAddZero; 
            $("#outtime" + i).text(staffArray[i].outTime);
            let hourSum = hours + Math.floor(time/60);
            let minSum = mins + time%60;
            timeArray = minsGreaterThan60(minSum, hourSum);
            timeArray[1] = hoursGreaterThan24(timeArray[1]);
            timeArray[0] = addZero(timeArray[0]);
            timeArray[1] = addZero(timeArray[1]);
            staffArray[i].expectedReturnTime = timeArray[1] + ':' + timeArray[0];
            $("#expectedreturntime" + i).text(staffArray[i].expectedReturnTime);
            staffArray[i].staffMemberIsLate();
            $("#" + id).removeClass('selected');
        }   
        else{
            alert("Please enter a valid number")
        }
    }
    else{
        alert("Please select a row")
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
    let id = $(".selected").attr('id');
    if(id != undefined){
        let i = id.slice(-1);
        staffArray[i].status = "In";
        $("#status" + i).text(staffArray[i].status);
        staffArray[i].duration = null;
        $("#duration" + i).text(staffArray[i].duration);
        staffArray[i].outTime = null;
        $("#outtime" + i).text(staffArray[i].outTime);
        staffArray[i].expectedReturnTime = null;
        $("#expectedreturntime" + i).text(staffArray[i].expectedReturnTime);
        clearInterval(staffArray[i].staffInterval);
    }
    else{
        alert("Please select a row");
    }
}

deliveryArray = []
function addDelivery(){
    let vehicle = $("#vehicle").val();
    let name = $("#name").val();
    let surname = $("#surname").val();
    let telephone = $("#telephone").val();
    let address = $("#address").val();
    let returnTime = $("#returnTime").val();
    if(validateDelivery(vehicle, name, surname, telephone, address, returnTime) == true){
        deliveryArray.push(new deliveryDriver(vehicleIcon(vehicle), name, surname, telephone, address, returnTime));
        for(let i = 0; i < deliveryArray.length; i++){
            if($("#row" + i ).length == 0){
                $("#deliveryTable").append("<tr id='row" + i + "' class='rowHover'></tr>")
                $("#row" + i).append("<td>" + deliveryArray[i].vehicle + "</td>")
                $("#row" + i).append("<td>" + deliveryArray[i].name + "</td>")
                $("#row" + i).append("<td>" + deliveryArray[i].surname + "</td>")
                $("#row" + i).append("<td>" + deliveryArray[i].telephone + "</td>")
                $("#row" + i).append("<td>" + deliveryArray[i].deliveryAddress + "</td>")
                $("#row" + i).append("<td>" + deliveryArray[i].returnTime + "</td>")
                deliveryArray[i].deliveryDriverIsLate();
            }
        }
        $('#vehicle').val('');
        $('#name').val('');
        $('#surname').val('');
        $('#telephone').val('');
        $('#address').val('');
        $('#returnTime').val('');
    }
}

function vehicleIcon(vehicle){
    if(vehicle == 'car' || vehicle == 'Car'){
        return "<i class='bi bi-car-front-fill'></i>";
    }
    else{
        return "<i class='bi bi-bicycle'></i>"
    }
}

function validateDelivery(vehicle, name, surname, telephone, address, returnTime){
    if([vehicle, name, surname, telephone, address, returnTime].every(element => String(element).length > 0)){
        let h = returnTime.split(':')[0];
        let m = returnTime.split(':')[1];
        if(!["Car","car", "motorcycle", "Motorcycle"].includes(vehicle)){
            alert("Please enter a valid vehicle type. That is 'Car' or 'Motorcycle'." )
        }
        else if(!(isNaN(name))){
            alert("Please enter a valid name.")
        }
        else if(!(isNaN(surname))){
            alert("Please enter a valid surname.")
        }
        else if(isNaN(telephone)){
            alert("Please enter a valid phone number.")
        }
        else if(!(isNaN(address))){
            alert("Please enter a valid address")
        }
        else if(returnTime.indexOf(":")<2){
            alert("Please enter a valid time format. That is 'hh:mm'.")
        }
        else if(isNaN(h) || parseInt(h)>23 || parseInt(h)<0 || h.length < 2){
            alert("Please enter a valid time format. That is 'hh:mm'.")
        }
        else if(isNaN(m) || parseInt(m)>59 || parseInt(m)<0 || m.length < 2){
            alert("Please enter a valid time format. That is 'hh:mm'.")
        }
        else{
            return true 
        }
    }
    else{
        alert("Do not leave any input elements empty")
    }
}

$(document).ready(function(){
    $('#deliveryTable').on('mousedown', 'tr', function() {
    $(this).toggleClass('selected');
    })
})

function clearDelivery(){
    let id = $(".selected").attr('id');
    if(id != undefined){
        if(confirm("Are you sure you want to clear the selected row?") == true){
            let i = id.slice(-1);
            $('#' + id).remove();
            deliveryArray.splice(i, 1);
        }
        else{
            alert("Clear cancelled!")
        }
    }
    else{
        alert("Please select a row")
    }
}