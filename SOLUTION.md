# Solution Docs

Developed in Javascript Vanilla (no JQuery or other libraries). Needed more time to complete and enhance the solution (TODO section)

To search for external endpoints, following parameters are required:

- endpoint: URL without GET parameters (plain endpoint url)
- search_param: parameter name where the text to search will be sent
- params: other key-params (param name-param value) to be sent in the request
- output: fields to grab from the response to pass to the Autocomplete element (Autocomplete element displays the results in a dropdown based in these parameters)

**Example:**

```
endpoint: {
   url:  `https://api.github.com/search/users`,
   search_param:  "q",
   params: {
      per_page:  10,
   },
   output: {
      text_param:  "login",
      value_param:  "id",
   },
}
```

## Met requirements:

- Enhance the component so that it also accepts an HTTP endpoint as data source. For example, if you wire up the component to https://api.github.com/search/users?q={query}&per_page={numOfResults}, and if you type foo in the input, the component dropdown should show Github users with logins that start with foo. When you select a user from the results, item in the onSelect(item) callback should be the selected Github user's id. (The enhanced initialised component only needs to work with either a data array or a HTTP source, not both at the same time.)

- Implement keyboard shortcuts to navigate the results dropdown using up/down arrow keys and to select a result using the Enter key.

- When item in dropdown is selected by mouse click or Enter key, show the selected item in a search field (same as Google is doing it).

## TODO

- Fixes:
  - scroll for autocomplete result's dropdown with more than 200px height
- Enhancements
  - Parameter Control/Validation for external endpoints
  - Export search text box element in a class
