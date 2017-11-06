//-------------------------------------------------------------
// SAMPLE WORKFLOW FOR SEQUENCE OF INITIALIZATION OF PROJECT
//-------------------------------------------------------------

//FIXME - add actual workflow later

var workflow = new (require('events').EventEmitter)();

workflow.on('doTask1', function() {
    console.log("[INFO] doing task 1....");
    return workflow.emit('doTask2');
});

workflow.on('doTask2', function() {
    console.log("[INFO] doing task 2....");
    return workflow.emit('doTask3');
});

workflow.on('doTask3', function() {
    console.log("[INFO] doing task 3....");
    return workflow.emit('workflowCompleted');
});

workflow.on('workflowCompleted', function() {
    console.log("[INFO] workflow completed....");
});

workflow.emit('doTask1');
