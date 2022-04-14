async function searchAccomodation(location) {
	const search = await fetch(`/accommodation/${location}`);
	const accomodations = await search.json();

	document.getElementById('results').innerHTML = '';
	accomodations.forEach((location) => {
		const p = document.createElement('p');
		const text = document.createTextNode(`${location.name} at ${location.location}, Type: ${location.type}, 
				Description: ${location.description}`);
		p.appendChild(text);

		const btn = document.createElement('input');
		btn.setAttribute('type', 'button');
		btn.setAttribute('value', 'Book!');
		btn.addEventListener('click', async (e) => {
			const accom = {
				accID: location.ID,
				thedate: 220601,
				username: "tempUsername",
				npeople: 2,
			};
			const BookAccomodation = await fetch(`/book`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(accom),
			});
			if (BookAccomodation.status == 200) {
				alert('Accomodation booked successfully');
			} else {
				const json = await response.json();
				alert(`Error booking accomodation: details ${json.error}`);
			}
		});
		document.getElementById('results').appendChild(p);
		document.getElementById('results').appendChild(btn);
	});
}

//)};

document.getElementById('Search!').addEventListener('click', () => {
	const location = document.getElementById('location').value;
	searchAccomodation(location);
});