const map = L.map('map1');

const attrib = 'Map data copyright OpenStreetMap contributors, Open Database Licence';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: attrib,
}).addTo(map);

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
			book(location.ID);
		});

		document.getElementById('results').appendChild(p);
		document.getElementById('results').appendChild(btn);

		const pos = [location.latitude, location.longitude];
		map.setView(pos, 8);
		const locationMarker = L.marker(pos).addTo(map);

		const avaliableDates = fetch(`/datesAvaliable/${location.ID}`)
			.then((response) => response.json())
			.then((result) => {
				let html = `Name: ${location.name}, Description: ${location.description}<br>
			<form>
			<p>Please choose a booking date:</p>`;
				result.forEach((date) => {
					html += `<input type="radio" id="date" name="dates" value="${date.thedate}">
  					<label for="date">${date.thedate}</label><br>`;
				});
				html += `
				<label for="quantity">Number of people:</label>
  				<input type="number" id="quantity" name="quantity" min="1" max="20"><br>
				<input id="btn_Book" type="button" value="Book!">
				</form>`;
				locationMarker.bindPopup(html);
				locationMarker.on('click', function (e) {
					document.getElementById('btn_Book').addEventListener('click', () => {
						const quantity = document.getElementById('quantity').value;
						var dates = document.getElementsByName('dates');
						var dateSelected;
						for (var i = 0; i < dates.length; i++) {
							if (dates[i].checked) {
								dateSelected = dates[i].value;
							}
						}
						book(location.ID, dateSelected, quantity);
					});
				});
			});
	});
}


async function book(id, date, numPeople) {
	const thedate = date;
	const npeople = numPeople;
	const username = '';
	
	var spacesLeft = 0
	const availability = await fetch(`/availability/id/${id}/date/${thedate}`);
	const results = await availability.json();
	results.forEach((result) => {
		spacesLeft = result.availability;
	});
	console.log(spacesLeft)

	const BookAccomodation = await fetch(
		`/book/id/${id}/date/${thedate}/people/${npeople}/availability/${spacesLeft}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: username }),
		}
	);
	if (BookAccomodation.status == 200) {
		alert('Accomodation booked successfully');
	} else if (BookAccomodation.status === 401) {
		alert('Error. user is not logged in.');
	} else if (BookAccomodation.status === 404) {
		const json = await BookAccomodation.json();
		alert(`Error. ${json.error}`);
	} else if (BookAccomodation.status === 406) {
		const json = await BookAccomodation.json();
		alert(`Error. ${json.error}`);
	} else {
		const json = await BookAccomodation.json();
		alert(`Error booking accomodation: details ${json.error}`);
	}
}

document.getElementById('Search!').addEventListener('click', () => {
	const location = document.getElementById('location').value;
	searchAccomodation(location);
});

function login(username, password) {
	const user = {
		username: username,
		password: password,
	};

	const response = fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	}).then((response) => {
		if (response.status == 401) {
			document.getElementById('loginMessage').innerHTML = 'Wrong Login details';
		} else {
			console.log('Login Complete! response:', response);
			document.getElementById('loginMessage').innerHTML = `
			Logged in as ${username}! <input type='button' value='Logout' id='logoutBtn' />`;

			document.getElementById('logoutBtn').addEventListener('click', () => {
				const logoutResponse = fetch('/logout', {
					method: 'POST',
				}).then((logoutResponse) => {
					if (logoutResponse.status == 200) {
						console.log('logout complete.');
						document.getElementById('loginMessage').innerHTML = `logout successful.`;
					} else {
						alert('Error! Something went wrong.');
					}
				});
			});
		}
	});
}

document.getElementById('loginBtn').addEventListener('click', () => {
	const username = document.getElementById('Username').value;
	const password = document.getElementById('Password').value;
	login(username, password);
});
