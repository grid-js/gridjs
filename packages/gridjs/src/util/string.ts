export function camelCase(str: string): string {
  if (!str) return '';

  const words = str.split(' ');

  // do not convert strings that are already in camelCase format
  if (words.length === 1 && /([a-z][A-Z])+/g.test(str)) {
    return str;
  }

  return words
    .map(function (word, index) {
      // if it is the first word, lowercase all the chars
      if (index == 0) {
        return word.toLowerCase();
      }

      // if it is not the first word only upper case the first char and lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}
