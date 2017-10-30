var doSomethingPeriodic = function(){
    var dt = new Data();
    console.log("[TEST-CLOCK] doing something at: " + dt);
}
setInterval(doSomethingPeriodic, 6000 * 5); // run every 5 mins

