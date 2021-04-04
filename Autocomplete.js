export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign(
      { numOfResults: 10, data: [], endpoint: {} },
      options
    );
    Object.assign(this, { rootEl, options });

    this.init();
  }

  async getUrlResults(url) {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      let param1 = this.options.endpoint.output.text_param;
      let param2 = this.options.endpoint.output.value_param;
      return data.items.map((user) => ({
        text: user[param1],
        value: user[param2],
      }));
    }
  }

  onQueryChange(query) {
    // Get data for the dropdown
    let results = [];
    if (this.options.data.length) {
      results = this.getResults(query, this.options.data);
      results = results.slice(0, this.options.numOfResults);
      this.updateDropdown(results);
    } else if (this.options.endpoint !== "") {
      //Compose URL
      let parsedUrl =
        this.options.endpoint.url +
        "?" +
        this.options.endpoint.search_param +
        "=" +
        query +
        this.encodeQueryData(this.options.endpoint.params);
      this.getUrlResults(parsedUrl).then((res) => {
        this.updateDropdown(res);
      });
    }
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  updateDropdown(results) {
    this.listEl.innerHTML = "";
    this.listEl.appendChild(this.createResultsEl(results));
    Object.assign(this.listEl, { className: "results" });
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement("li");
      Object.assign(el, {
        className: "result",
        textContent: result.text,
      });
      el.setAttribute("value", result.value);
      // Pass the value to the onSelect callback
      el.addEventListener("click", (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === "function") {
          window.location.href = "http://localhost:8080/?q=" + result.text;
        }
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement("input");
    Object.assign(inputEl, {
      type: "search",
      name: "query",
      autocomplete: "off",
    });

    inputEl.addEventListener("input", (event) =>
      this.onQueryChange(event.target.value)
    );

    //Handle keystrokes
    inputEl.addEventListener("keydown", (event) => {
      const listEls = this.listEl.getElementsByTagName("li");

      switch (event.key) {
        case "ArrowDown":
          if (this.selectedListItem > -1) {
            listEls[this.selectedListItem].classList.remove("selected");

            if (this.selectedListItem < listEls.length - 1) {
              this.selectedListItem++;
            } else {
              this.selectedListItem = 0;
            }

            listEls[this.selectedListItem].classList.add("selected");
          } else {
            this.selectedListItem = 0;
            listEls[this.selectedListItem].classList.add("selected");
          }
          break;

        case "ArrowUp":
          if (this.selectedListItem > -1) {
            listEls[this.selectedListItem].classList.remove("selected");
            if (this.selectedListItem > 0) {
              this.selectedListItem--;
            } else {
              this.selectedListItem = listEls.length - 1;
            }

            listEls[this.selectedListItem].classList.add("selected");
          } else {
            this.selectedListItem = listEls.length - 1;
            listEls[this.selectedListItem].classList.add("selected");
          }
          break;

        case "Enter":
          if (this.selectedListItem > -1) {
            window.location.href =
              "http://localhost:8080/?q=" +
              listEls[this.selectedListItem].innerText;
          }
          break;
      }
    });

    return inputEl;
  }

  onKeyChange(key) {
    let index = this.selectedIndex;
    // Compute Index
    index =
      key === "ArrowUp"
        ? index > 0
          ? this.selectedIndex - 1
          : 0
        : index < this.listEl.childElementCount - 1
        ? index + 1
        : this.listEl.childElementCount - 1;
    // Set selected index
    this.setSelectedIndex(index);
  }

  onSelectItem(value) {
    const { onSelect } = this.options;
    if (typeof onSelect === "function") onSelect(value);
  }

  encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return "&" + ret.join("&");
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl);

    // Build results dropdown
    this.listEl = document.createElement("ul");
    this.rootEl.appendChild(this.listEl);
  }
}
