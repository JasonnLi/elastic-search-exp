import { devSetting } from "./development.config";
import { testSetting } from "./testing.config";
import { stageSetting } from "./staging.config";
import { prodSetting } from "./production.config";

module.exports = function () {
  switch (process.env.NODE_ENV) {
    case "testing":
      return { testSetting };

    case "staging":
      return { stageSetting };

    case "production":
      return { prodSetting };

    default:
      return { devSetting };
  }
};

