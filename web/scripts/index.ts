import { resolve } from "path";
import { generateApi } from "swagger-typescript-api";

generateApi({
  url: "http://localhost:4400/documentation/json",
  output: resolve(process.cwd(), "common/types/dto-generated/"),
  name: "api.types.ts",
  generateResponses: true,
  generateRouteTypes: true,
  cleanOutput: false,
  typeSuffix: "DTO",
  extractEnums: true,
  addReadonly: true,
  generateClient: true,
  httpClientType: "axios",
  prettier: {
    singleQuote: true,
    endOfLine: "lf",
  },
}).then(() => {
  console.info("Successful generated");
});
