// geocoder.js

class CityGeocoder {
  constructor(jsonUrl) {
    this.cities = [];
    this.loaded = false;

    // preload the dataset
    fetch(jsonUrl)
      .then(res => res.json())
      .then(data => {
        this.cities = data;
        this.loaded = true;
        console.log("CityGeocoder loaded:", this.cities.length, "cities");
      })
      .catch(err => console.error("Failed to load city data:", err));
  }

  // haversine distance in km
  static haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // return nearest city object {id, name, lat, lng, pop, fc}
  reverse(lat, lng) {
    if (!this.loaded) {
      console.warn("CityGeocoder data not loaded yet.");
      return null;
    }

    let nearest = null;
    let minDist = Infinity;

    for (const city of this.cities) {
      const dist = CityGeocoder.haversine(lat, lng, city.lat, city.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }

    return nearest;
  }
}

// export if running in a module environment
if (typeof window !== "undefined") {
  window.CityGeocoder = CityGeocoder;
}
