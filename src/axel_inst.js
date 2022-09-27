import {Client} from "@axelapi/sdk";
import {api_key} from "./secrets/api_key";

export const axel = new Client(api_key);
window.axel = axel;
