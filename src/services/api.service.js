import http from "../api-conexion";

class CrudService {

  getAllCountries() {
    return http.get("/timezone");
  }
  getTimeZoneCountrie(countrie) {
    return http.get(`/timezone/${countrie}`);
  }
}

export default new CrudService();