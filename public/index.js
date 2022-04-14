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
			const accom = {
				accID: location.ID,
				thedate: 220601,
				username: 'tempUsername',
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
			} else if (BookAccomodation.status === 401) {
				alert('Error. user is not logged in.');
			} else {
				const json = await response.json();
				alert(`Error booking accomodation: details ${json.error}`);
			}
		});
		document.getElementById('results').appendChild(p);
		document.getElementById('results').appendChild(btn);

		const pos = [location.latitude, location.longitude];
		map.setView(pos, 8);
		const locationMarker = L.marker(pos).addTo(map);
		locationMarker.bindPopup(`Name: ${location.name}, Description: ${location.description}`);
	});
}

//)};

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