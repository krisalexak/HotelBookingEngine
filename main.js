window.onload = () => {

    const hotelSection = document.getElementById('hotelSection');
    const searchBar = document.getElementById('searchBar');
    const maxPriceLabel = document.getElementById('maxPrice');
    const hotelLocations = document.getElementById('hotelLocation');
    const map = document.getElementById('map');
    const roomType = document.getElementById('roomTypes');
    const searchButton = document.getElementById('searchButton');
    const priceSlider = document.getElementById('priceSlider');
    const propertyType = document.getElementById('propertyTypes');
    const guestRating = document.getElementById('guestRatings');
    const hotelLocation = document.getElementById('hotelLocation');
    const sortBy = document.getElementById('myFilters');
    const logo=document.getElementById('logo');
    
    init();

    async function init() {

        const data = await fetch('data.json')
            .then(response => response.json())
            .then((data) => {
                return data;
            });
        const roomtypes = data[0].roomtypes;
        const hotels = data[1].entries;
        
        const maxPrice = hotels
            .reduce((prev, current) => {return prev.price < current.price ? current : prev})
            .price;
        showHotels(hotels);
        priceSlider['max'] = maxPrice;
        priceSlider['value'] = maxPrice;
        maxPriceLabel.innerHTML = `max:${maxPrice}`;

        let filters = [];
        hotels.map(hotel => {
            hotel.filters.map(filter => {
                if (!filters.includes(filter.name)) {
                    filters.push(filter.name);
                }
            })
        })
        filters.map(filter => sortBy.innerHTML += `<option value=${filter}>${filter}</option>`);
        map['src'] = hotels[0].mapurl;

        roomtypes.map(rt => roomType.innerHTML += `<option value= ${rt.name}> ${rt.name}</option>`);
        hotels.map((hotel => hotelLocations.innerHTML += `<option value="${hotel.city}">${hotel.city}</option>`));

        searchBar.addEventListener('keyup', function (e) {

            let selectedHotels = hotels.filter(hotel => hotel.city.toLowerCase().includes(e.target.value.toLowerCase()))
                .filter(hotel => hotel.price <= priceSlider.value);
            showHotels(selectedHotels);
        });

        priceSlider.addEventListener('input', (e) => {

            let selectedHotels = hotels.filter(hotel => hotel.price <= e.target.value)
                .filter(hotel => hotel.city.toLowerCase().includes(searchBar.value.toLowerCase()));
            showHotels(selectedHotels);
        });

        searchButton.addEventListener('click', () => {
           
            let selectedHotels = hotels
                .filter(hotel => hotel.price <= priceSlider.value)
                .filter(hotel => guestRating.value === "" ? hotel : hotel.ratings.text == guestRating.value)
                .filter(hotel => propertyType.value === "" ? hotel : hotel.rating == propertyType.value)
                .filter(hotel => hotelLocation.value === "" ? hotel : hotel.city == hotelLocation.value)
                .filter(hotel=> sortBy.value===""?hotel:hotel.filters.some(filter=>filter.name==sortBy.value));
            
            showHotels(selectedHotels);
        });
    }

    logo.addEventListener('click',()=>location.reload());

    showHotels = function (hotels) {
        hotelSection.innerHTML = '';
        hotels.map((hotel) => hotelSection.innerHTML += addHotel(hotel))
    };

    showStars = function (hotel) {
        let stars = '';
        for (let i = 0; i < hotel.rating; i++) {
            stars += '<span class="fa fa-star checked fa-sm"></span>';

        }
        for (let i = 0; i < 5 - hotel.rating; i++) {
            stars += `<span class="fa fa-star fa-sm"></span>`;

        }
        return stars;
    };

    addHotel = function (hotel) {
        return `
            <div class="hotel-post">
                <img src=${hotel.thumbnail} height="200" width="200">
                <div class="description">
                    <strong class="title">${hotel.hotelName}</strong>
                    <div>
                        ${showStars(hotel)}
                        <span>Hotel</span>
                    </div><br>
                    <p>${hotel.city}</p>
                    
                    <p><strong>${hotel.ratings.text}</strong> (${hotel.ratings.no}/10)</p>
                </div>
        
                <div class="deals">
                    <div class="recommended-deals">
                        <p>Hotel website <br>$${hotel.price}
                            <p>Agoda <br>$575</p>
                            <p>Travelocity <br>$708</p>
                    </div>
                    <div class="more-deals">
                        <strong>More deals from <br>$575</strong>
        
                    </div>
                </div>
        
                <div class="selected-deal">
                    <p>Hotel Website <br>$${hotel.price} <br>3 nights for $${3*hotel.price}</p>
                    <button type="button" class="btn btn-primary">View Deal</button>
                </div>
        
            </div>`;
    }



}