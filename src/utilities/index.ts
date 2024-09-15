export function flattenObject(obj: any, parent = "", res: any = {}) {
  for (let key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      let propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        // Recursive call for nested objects
        flattenObject(obj[key], propName, res);
      } else {
        // Assign the value if it's not an object
        res[propName] = obj[key];
      }
    }
  }
  return res;
}
