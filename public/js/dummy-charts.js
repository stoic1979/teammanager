 new Chart(document.getElementById("pie-chart"), {
    	type: 'pie',
    	data: {
      	labels: ["Tasks" , "Bugs", "Enhancements", "Finished Issues"],
      	datasets: [{
        label: "Population (millions)",
        backgroundColor: ["orange", "red","green","blue","pink"],
        data: [40,15,25,30]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Team Manager'
      }
    }
	});