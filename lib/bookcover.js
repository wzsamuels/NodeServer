 import fetch from 'node-fetch';
 
 export default async function getCover(title) {   

  const api = "https://en.wikipedia.org/w/api.php?";

  // Get search results for the title
  let url = api + new URLSearchParams({
    origin: "*",
    action: "query",
    list: "search",
    srsearch: title,
    format: "json",
  });

  let data;
  try {
    const req = await fetch(url);
    const json = await req.json();
    data = json;
  } catch (e) {
    console.error(e);
  }

  // Check to see if any results were found
  if(data['query']['searchinfo']['totalhits'] === 0) {
    return null;
  }

  // Assume the best search result is the first
  let pageid = data['query']['search'][0]['pageid'];
  // But try to find a better result for by checking for "(novel)"
  for(const result of data['query']['search']) {
    if(result['title'].search('(novel)') !== -1) {
      pageid = result['pageid'];
    }
  }

  /*
  if(pageid === 0) {
    pageid = data['query']['search'][0]['pageid'];
  }*/

  /// Find all the images on the page
  url = api + new URLSearchParams({
    origin: "*",
    action: "parse",
    pageid: pageid,
    redirect: "true",
    format: "json",
  });

  try {
    const req = await fetch(url);
    const json = await req.json();
    data = json;
  } catch (e) {
    console.error(e);
  }

  // An array of all image files on the page
  let imageArray = data.parse["images"];
  // The best image found so far. Default to first.
  let bestImage =  imageArray[0];
  let titleWords = title.split(" ");
  let maxCount = 0;
  let maxCountIndex = -1;

  let regex = /\.(png|svg|jpg|jpeg|gif)$/i;

  for (let i = 0; i < imageArray.length; i++) {
    let count = 0;
    for (const titleWord of titleWords) {
      //if (ciEquals(titleWord, imageWord)) {
      if(imageArray[i].toLowerCase().includes(titleWord.toLowerCase())) {
        count++;
      }
    }
    if (count > maxCount && regex.test(imageArray[i])) {
      maxCount = count;
      maxCountIndex = i;
    }
  }

  if (maxCountIndex > -1) {
    bestImage = imageArray[maxCountIndex];
  }
  else
    console.log(imageArray);

  // Get the URL of the image
  url = api + new URLSearchParams({
    origin: "*",
    action: 'query',
    titles: "Image:" + bestImage,
    prop: "imageinfo",
    iiprop: "url",
    format: 'json'
  });
  let imageUrl = null;
  try {
    const req = await fetch(url);
    const json = await req.json();
    let dataResponse = json;
    imageUrl = Object.values(dataResponse['query']['pages'])[0]['imageinfo'][0]['url'];
  } catch (e) {
    console.error(e);
  }
  return imageUrl;
}

function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}