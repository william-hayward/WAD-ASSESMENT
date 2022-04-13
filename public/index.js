function searchAccomodation(location){
	fetch(`https://wad-assessment-klisa.run-eu-central1.goorm.io/accommodation/${location}`)
		.then(response => response.json())
		.then(results => {
		let html = `<table> 
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Location</th>
						<th>Description</th>
						<th>Book Accomodation!</th>
					</tr>`;
		document.getElementById('results').innerHTML=""
		
		results.forEach(location => {
			 html += `
				<tr>
				<td>${location.name}</td>
				<td>${location.type}</td>
				<td>${location.location}</td>
				<td>${location.description}</td>
				<td> <input type='button' id='Book!' value="Book"/></td>
				</tr>`
			 
			document.getElementById('results').innerHTML = html;
		});
	});
}

document.getElementById("Search!").addEventListener("click", () => {
    // Read the artist from a text field
    const location = document.getElementById('location').value;
    searchAccomodation(location);
});