// This file is generated from config/master.schema.json.
// Auto-generated MasterConfig type derived directly from the schema.
// Do NOT hand-edit – run `npm run generate-types` (to be added) instead.

import schema from "../../config/master.schema.json";
import { FromSchema } from "json-schema-to-ts";

export type MasterConfig = FromSchema<typeof schema>; 