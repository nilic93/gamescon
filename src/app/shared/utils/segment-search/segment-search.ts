/**
 * @desc This method checks if segment search is requested, MIN_LENGTH is minimum number of character in string that is needed to be requested valid segment search
 * @param segment
 * @returns boolean
 */
export const segmentSearch = (segment:string):boolean => {
  const MIN_LENGTH = 4;
  const firstChar = segment[0];
  const lastChar = segment.length > MIN_LENGTH ? segment[segment.length - 1] : '';
  return firstChar === "%" && lastChar === "%";
  }

