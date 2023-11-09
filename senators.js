let senators;
let uniqueParties;


//function to get the senators from the JSON file adapted from the lecture notes
async function getSenators() {
    try{
        const url= "senators.json";
        const response = await fetch(url);

        //check if request was successful
        if(!response.ok){
            throw new Error (
                'HTTP error status: ' + response.status
            );
        }
        
        const data = await response.json();
        senators = data.objects;
        
        //map loops through the array and returns the party for each senator
        //new Set removes duplicates
        //... converts back to array
        uniqueParties = [...new Set(senators.map(senator => senator.party))];
        partyCount();
        getLeaders();
        senatorTable();
        fillPartySelect();
        fillStateSelect();
        fillRankSelect();
    }
    catch(error){
        document.getElementById("errors").textContent = error;
    }
}


function partyCount(){
    //This function gets the number of senators in each party and displays them
    const partyCount = document.getElementById("parties");
    for(let i=0; i<uniqueParties.length; i++){
        let count = 0;
        for(let j=0; j<senators.length; j++){
            if(uniqueParties[i] === senators[j].party){
                count++;
            }
        }
        partyCount.innerHTML += "<div class='party-count' ><h2>" + uniqueParties[i] + "</h2><h1>" + count + "</h1></div>";
    }

}

function getLeaders(){
    //This function gets the senators in leadership roles and displays them
    const leaders  = document.getElementById("leaders");
    for(let i=0; i<uniqueParties.length; i++){
        let count = 0;
        leaders.innerHTML += "<h2>" + uniqueParties[i] + "</h2>";
        for(let j=0; j<senators.length; j++){
            if(uniqueParties[i] === senators[j].party && senators[j].leadership_title != null){
                count++;
                leaders.innerHTML += "<p><span>" + senators[j].person.firstname + " " +  senators[j].person.lastname + "</span><br>" + senators[j].leadership_title + "</p>";
            }
        }
        if(count === 0){
            leaders.innerHTML += "<p>There are no senators in leadership roles for " + uniqueParties[i] + "</p>";
        }
    }
}

function senatorTable(){
    //This function fills the table with the senator data
    const table = document.getElementById("senatorTable");
    table.innerHTML += "<tbody>"
    for(let i=0; i<senators.length; i++){
        table.innerHTML += "<tr onclick='moreInfo("+i+")' class='row'><td>" + senators[i].person.firstname + " " + senators[i].person.lastname + "</td><td>" + senators[i].party + "</td><td>" + senators[i].state + "</td><td>"+ senators[i].person.gender.charAt(0).toUpperCase() + senators[i].person.gender.slice(1) + "</td><td>"+ senators[i].senator_rank_label + "</td></tr>";
    }
    table.innerHTML += "</tbody>"
}

function fillPartySelect(){
    //This function fills the options for the party select dropdown
    const partyFilter = document.getElementById("partyFilter");
    for(let i=0; i<uniqueParties.length; i++){
        partyFilter.innerHTML += "<option value='" + uniqueParties[i] + "'>" + uniqueParties[i] + "</option>";
    }
}

function fillStateSelect(){
    //This function fills the options for the state select dropdown
    const stateFilter = document.getElementById("stateFilter");
    //get all the states
    let states = [...new Set(senators.map(senator => senator.state))];
    //sort the states
    states.sort();
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.text = state;
        stateFilter.appendChild(option);
      });
}

function fillRankSelect(){
    //This function fills the options for the Rank select dropdown
    const rankFilter = document.getElementById("rankFilter");
    let ranks = [...new Set(senators.map(senator => senator.senator_rank_label))];
    ranks.forEach(rank => {
        const option = document.createElement('option');
        option.value = rank;
        option.text = rank;
        rankFilter.appendChild(option);
    });
}

function filterTable(){
    //This function runs when the select dropdowns are changed
    //It filters the table based on the selected values
    const table = document.getElementById("senatorTable");
    const partyFilter = document.getElementById("partyFilter").value.toUpperCase();
    const stateFilter = document.getElementById("stateFilter").value.toUpperCase();
    const rankFilter = document.getElementById("rankFilter").value.toUpperCase();
    const searchFilter = document.getElementById("searchFilter").value.toUpperCase();
    let rows_hidden = 0;
    for(let i=1; i<table.rows.length; i++){
        let row = table.rows[i];
        //This goes through each cell in the row and adds the text to a string so we can use the text search filter
        let rowString = ""
        for(let j=0; j<row.cells.length; j++){
            rowString += row.cells[j].textContent.toUpperCase() + " ";
        }
        
        let party = row.cells[1].textContent.toUpperCase();
        let state = row.cells[2].textContent.toUpperCase();
        let rank = row.cells[4].textContent.toUpperCase();
        if((party === partyFilter || partyFilter === "")
        && (state === stateFilter || stateFilter === "")
        && (rank === rankFilter || rankFilter === "")
        && (rowString.indexOf(searchFilter) > -1)){//search filter checks if search string is a substring of the row string
            row.style.display = "";
        }else{
            row.style.display = "none";
            rows_hidden++;
        }
        /* 
        the filter function checks if the party, state, and rank of the senator match the filters
        eg how it works
        party = "REPUBLICAN"
        partyFilter = "REPUBLICAN"
        indexOf returns 0 because REPUBLICAN is in REPUBLICAN
        */
    }
    if(rows_hidden === table.rows.length - 1){
        document.getElementById("noResults").style.display = "";
    }else{
        document.getElementById("noResults").style.display = "none";
    }
}

function moreInfo(i){
    //This function displays a modal with more info about the senator
    
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = "<h1 class=person-name>" + senators[i].person.firstname + " " + senators[i].person.lastname + "</h1>";
    let text = "<p><strong>Party:</strong> " + senators[i].party + "</p>";
    text += "<p><strong>State:</strong> " + senators[i].state + "</p>";
    text += "<p><strong>Rank:</strong> " + senators[i].senator_rank_label + "</p>";
    text += "<p><strong>Office:</strong> " + senators[i].extra.office + "</p>";
    text += "<p><strong>Date of Birth:</strong> " + senators[i].person.birthday + "</p>";
    text += "<p><strong>Start Date:</strong> " + senators[i].startdate + "</p>";
    if(senators[i].person.twitterid != null){
        text += "<p><strong>Twitter:</strong> <a href='https://twitter.com/" + senators[i].person.twitterid + "' target='_blank'>" + senators[i].person.twitterid + "</a></p>";
    }
    if(senators[i].person.youtubeid != null){
        text += "<p><strong>Youtube:</strong> <a href='https://www.youtube.com/user/" + senators[i].person.youtubeid + "' target='_blank'>" + senators[i].person.youtubeid + "</a></p>";
    }
    text += "<p><strong>Website:</strong> <a href='" + senators[i].website + "' target='_blank'>" + senators[i].website + "</a></p>";
    modalContent.innerHTML += text;
    document.getElementById("modal").style.display = "block";
}


window.onclick = function(event) {
    //This function closes the modal when the user clicks outside of it
    if (event.target == modal) {
        document.getElementById("modal").style.display = "none";
    }
  };


getSenators();

