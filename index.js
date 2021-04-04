import Autocomplete from "./Autocomplete";
import usStates from "./us-states";
import "./main.css";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const q = urlParams.get("q");
document.getElementById("search").value = q;

// US States
const data = usStates.map((state) => ({
  text: state.name,
  value: state.abbreviation,
}));
new Autocomplete(document.getElementById("state"), {
  data,
  onSelect: (stateCode) => {
    console.log("selected state:", stateCode);
  },
});

//Github Users
new Autocomplete(document.getElementById("gh-user"), {
  endpoint: {
    url: `https://api.github.com/search/users`,
    search_param: "q",
    params: {
      per_page: 10,
    },
    output: {
      text_param: "login",
      value_param: "id",
    },
  },
  onSelect: (ghUserId) => {
    console.log("selected github user id:", ghUserId);
  },
});
