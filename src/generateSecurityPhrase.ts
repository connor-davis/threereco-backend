import SHA512 from "crypto-js/hmac-sha512";
import { enc } from "crypto-js";

const args = process.argv.splice(2);

for (let i = 0; i < args.length; i++) {
  let arg = args[i];

  switch (arg) {
    case "-keyword":
      const keywordIndex = i;
      const keywordValue = args[keywordIndex + 1];
      const keyValue = args[keywordIndex + 2];

      console.log(SHA512(keywordValue, keyValue).toString(enc.Hex));

      break;
    default:
      break;
  }
}

// console.log(SHA512())
