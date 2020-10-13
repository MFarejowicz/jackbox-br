// ex: formatParams({ some_key: "some_value", a: "b"}) => "some_key=some_value&a=b"
function formatParams(params) {
  // iterate of all the keys of params as an array,
  // map it to a new array of URL string encoded key,value pairs
  // join all the url params using an ampersand (&).
  return Object.keys(params)
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
}

// convert a fetch result to a JSON Object with error handling for fetch and json errors
async function convertToJSON(res) {
  if (!res.ok) {
    throw new Error(
      `API request failed with response status ${res.status} and text: ${res.statusText}`
    );
  }

  try {
    const json = await res.json();
    return json;
  } catch (err) {
    throw new Error(`API request's result could not be converted to a JSON object: \n${err}`);
  }
}

// helper code to make a get request. Default parameter of empty JSON Object for params
export async function get(endpoint, params = {}) {
  const fullPath = endpoint + "?" + formatParams(params);
  try {
    const res = await fetch(fullPath);
    const json = await convertToJSON(res);
    return json;
  } catch (err) {
    throw new Error(`GET request to ${fullPath} failed with error:\n${err}`);
  }
}

// helper code to make a post request. Default parameter of empty JSON Object for params
export async function post(endpoint, params = {}) {
  try {
    const res = await fetch(endpoint, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = await convertToJSON(res);
    return json;
  } catch (err) {
    throw new Error(`POST request to ${endpoint} failed with error:\n${err}`);
  }
}
