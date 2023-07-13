// @ts-ignore
import SnowflakeId from "snowflake-id";

export default new SnowflakeId({
  mid: 42,
  offset: (2023 - 1970) * 31536000 * 1000,
});
