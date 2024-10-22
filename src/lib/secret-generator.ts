import { sha512 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

const SecretGenerator = async () => {
  const secretString = new TextEncoder().encode(`charos-api.${Date.now()}`);
  const secretHash = await sha512(secretString);
  const secretHex = encodeHex(secretHash);

  console.log(secretHex.length);

  return secretHex;
};

export default SecretGenerator;
