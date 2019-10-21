
export function highlightMatch(text, regions)
{
  const result = [];
  for (let regionIndex = 0; regionIndex < regions.length; ++regionIndex) {
    // Make a copy, shift() is modifying the array and that cost me 2h.
    // Don't copy-and-paste without reading the code, kids.
    const matches = [...regions[regionIndex].indices];

    var pair = matches.shift();
    // Build the formatted string
    for (var i = 0; i < text.length; i++) {
      var char = text.charAt(i);
      if (pair && i === pair[0]) {
        result.push('<b>')
      }

      result.push(char);

      if (pair && i === pair[1]) {
        result.push('</b>')
        pair = matches.shift();
      }
    }
  }

  return result.join('');
}
