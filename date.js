module.exports=getDate;
function getDate(){
    var today= new Date();
var options={
    weekday:"long",year:"numeric",month:"long",day:"numeric"
};
 var day=today.toLocaleDateString("en-us",options);
 return day;
}