 import fetch from 'node-fetch';
 
 export default async function getCover(title) {   

  const api = "https://en.wikipedia.org/w/api.php?";
  let bookData = {};

  // Get search results for the title
  let url = api + new URLSearchParams({
    origin: "*",
    action: "query",
    list: "search",
    srsearch: title,
    format: "json",
  });

  let data;
  await new Promise(r => setTimeout(r, 500));
  try {
    let delay = 0;
    let req;
    do {
      await new Promise(r => setTimeout(r, delay));
      req = await fetch(url);  
      delay += 100;
    } while(req.status === 429)    
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
  let pagetitle = data['query']['search'][0]['title'];
  // But try to find a better result for by checking for "(novel)"
  for(const result of data['query']['search']) {
    if(result['title'].search('(novel)') !== -1) {
      pageid = result['pageid'];
      pagetitle = result['title'];
    }
  }  

  /// Get the book's summary

  url = api + new URLSearchParams({
    origin: "*",
    action: "query",
    prop: "extracts",
    exsentences: "10",
    exlimit: "1",
    titles: pagetitle,
    explaintext: "1",
    formatversion: "2",
    redirect: "true",
    format: "json",
  });

  try {
    let delay = 0;
    let req;
    do {
      await new Promise(r => setTimeout(r, delay));
      req = await fetch(url);  
      delay += 100;
    } while(req.status === 429)    
    const json = await req.json();
    data = json;
  } catch (e) {
    console.error(e);
  }

  let summary = data['query']['pages'][0]['extract'];

  // Get the full contents of the correct (hopefully) book's entry
  url = api + new URLSearchParams({
    origin: "*",
    action: "parse",
    pageid: pageid,
    redirect: "true",
    format: "json",
  });

  await new Promise(r => setTimeout(r, 500));
  try {
    let delay = 0;
    let req;
    do {
      await new Promise(r => setTimeout(r, delay));
      req = await fetch(url);  
      delay += 100;
    } while(req.status === 429)    
    const json = await req.json();
    data = json;
  } catch (e) {
    console.error(e);
  }

  /* Get the year published */
  let published = "";
  let pagetext = data["parse"]["text"]["*"];
  let index = pagetext.search("Published");
  let offset = 9;
  if(index === -1) {
    index = pagetext.search("Publication")
    offset = 16;
  }
  index += offset;
  let inHTML = false;
  let nextChar = pagetext[index];
  while(index < pagetext.length && published === "") {
    if((pagetext[index] !== '<' || pagetext[index] !== '\\') && !inHTML) {
      while(pagetext[index] !== '<') {
        published += pagetext[index];
        index++;
      }
      break;
    }
    if(pagetext[index] === '<')
      inHTML = true;
    if(pagetext[index] === '>')
      inHTML = false;
    index++;
  }

url = api + new URLSearchParams({
  origin: "*",
  action: "parse",
  pageid: pageid,
  redirect: "true",
  format: "json",
});

await new Promise(r => setTimeout(r, 500));
try {
  let delay = 0;
  let req;
    do {
      await new Promise(r => setTimeout(r, delay));
      req = await fetch(url);  
      delay += 100;
    } while(req.status === 429)    
  const json = await req.json();
  data = json;
} catch (e) {
  console.error(e);
}



  /// Find all the images on the page
  // An array of all image files on the page
  let imageArray = data["parse"]["images"];
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
  let cover = null;
  try {
    let dataResponse;
    let delay = 0;
    let req;
      do {
        await new Promise(r => setTimeout(r, delay));
        req = await fetch(url);  
        delay += 100;
      } while(req.status === 429)    
    const json = await req.json();
    dataResponse = json
    cover = Object.values(dataResponse['query']['pages'])[0]['imageinfo'][0]['url'];
  } catch (e) {
    console.error(e);
  }
  //sleep(2000);
  //let published = 1990;
  return { cover, summary, published };
}

function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}

