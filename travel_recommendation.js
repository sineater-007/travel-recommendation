function searchCondition() {
    const input = document.getElementById('destinationInput').value.toLowerCase().trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const Time = new Date().toLocaleTimeString('en-US', options);

    fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        const results = [];

        if (input === 'country' || input === 'countries') {
            data.countries.forEach(country => {
                if (Array.isArray(country.cities) && country.cities.length > 0) {
                    results.push({ type: 'Country', name: country.name });
        
                    country.cities.forEach(city => {
                        results.push({
                            type: 'City',
                            name: city.name,
                            from: country.name,
                            image: city.imageUrl,
                            description: city.description
                        });
                    });
                }
            });
        }
        

        else if (input === 'temple' || input === 'temples') {
            (data.temples || []).forEach(temple => {
                results.push({
                    type: 'Temple',
                    name: temple.name,
                    image: temple.imageUrl,
                    description: temple.description
                });
            });
        }

        else if (input === 'beach' || input === 'beaches') {
            (data.beaches || []).forEach(beach => {
                results.push({
                    type: 'Beach',
                    name: beach.name,
                    image: beach.imageUrl,
                    description: beach.description
                });
            });
        }

        else {
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(input)) {
                    results.push({ type: 'Country', name: country.name });
                }

                (country.cities || []).forEach(city => {
                    if (city.name.toLowerCase().includes(input)) {
                        results.push({
                            type: 'City',
                            name: city.name,
                            from: country.name,
                            image: city.imageUrl,
                            description: city.description
                        });
                    }
                });
            });

            (data.temples || []).forEach(temple => {
                if (temple.name.toLowerCase().includes(input) || temple.description.toLowerCase().includes(input)) {
                    results.push({
                        type: 'Temple',
                        name: temple.name,
                        image: temple.imageUrl,
                        description: temple.description
                    });
                }
            });

            (data.beaches || []).forEach(beach => {
                if (beach.name.toLowerCase().includes(input) || beach.description.toLowerCase().includes(input)) {
                    results.push({
                        type: 'Beach',
                        name: beach.name,
                        image: beach.imageUrl,
                        description: beach.description
                    });
                }
            });
        }

        if (results.length > 0) {
            results.forEach(item => {
                const div = document.createElement('div');
                div.className = 'result-item';
                div.innerHTML = `
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 300px; max-width: 100%; margin-bottom: 8px;">` : ''}
                    <h3>${item.name}${item.from ? ' <span style="font-weight: normal;">(from ' + item.from + ')</span>' : ''}</h3>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                    <hr/>
                `;
                resultDiv.appendChild(div);
            });
        } else {
            resultDiv.innerHTML = '<p>No results found.</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
    });
    console.log("Current time in New York:", newYorkTime);
}


btnSearch.addEventListener('click', searchCondition);

function clearResult() {
    document.getElementById('destinationInput').value = '';
    document.getElementById('result').innerHTML = '';
}
btnClear.addEventListener('click', clearResult);

