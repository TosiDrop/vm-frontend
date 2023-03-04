import {
  GetEpochParamsDto,
  GetPopupInfoDto,
  GetQueueDto,
  GetTipDto,
  ProjectsDto,
} from "../../client/src/entities/dto";

interface OapiSchemaProperty {
  type: "string" | "integer" | "object";
  properties?: OapiSchemaProperties<any>;
}

type OapiSchemaProperties<T> = Record<keyof T, OapiSchemaProperty>;

interface OapiParameter {
  name: string;
  in: string;
  required: boolean;
}

interface OapiResponse<T> {
  content: {
    "application/json": {
      schema: {
        type: "object";
        properties: OapiSchemaProperties<T>;
      };
    };
  };
}

interface OapiPath<T> {
  parameters?: OapiParameter[];
  responses: Record<number, OapiResponse<T>>;
}

export const getqueueOapiPath: OapiPath<GetQueueDto> = {
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              pending_tx: { type: "string" },
            },
          },
        },
      },
    },
  },
};

export const getpopupinfoOapiPath: OapiPath<GetPopupInfoDto> = {
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              text: { type: "string" },
              buttonText: { type: "string" },
              buttonLink: { type: "string" },
            },
          },
        },
      },
    },
  },
};

const getprojectsOapiPathLogo: OapiSchemaProperties<ProjectsDto.Logo> = {
  logoDefault: { type: "string" },
  logoDark: { type: "string" },
  logoCompact: { type: "string" },
  logoCompactDark: { type: "string" },
};
const getprojectsOapiPathDesc: OapiSchemaProperties<ProjectsDto.Desc> = {
  descShort: { type: "string" },
  descLong: { type: "string" },
  claimDesc: { type: "string" },
};
const getprojectsOapiPathUrl: OapiSchemaProperties<ProjectsDto.Url> = {
  website: { type: "string" },
  medium: { type: "string" },
  twitter: { type: "string" },
  discord: { type: "string" },
  telegram: { type: "string" },
  paper: { type: "string" },
  docs: { type: "string" },
  github: { type: "string" },
  cardanoScan: { type: "string" },
  poolpm: { type: "string" },
};
const getprojectsOapiPathTokenInfo: OapiSchemaProperties<ProjectsDto.TokenInfo> =
  {
    token: { type: "string" },
    totalSupply: { type: "integer" },
    policyID: { type: "string" },
  };
export const getprojectsOapiPath: OapiPath<ProjectsDto.GetProjects> = {
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              logos: {
                type: "object",
                properties: getprojectsOapiPathLogo,
              },
              descs: {
                type: "object",
                properties: getprojectsOapiPathDesc,
              },
              token: {
                type: "object",
                properties: getprojectsOapiPathTokenInfo,
              },
              urls: {
                type: "object",
                properties: getprojectsOapiPathUrl,
              },
            },
          },
        },
      },
    },
  },
};

export const getepochparamsOapiPath: OapiPath<GetEpochParamsDto> = {
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              epoch_no: { type: "integer" },
              min_fee_a: { type: "integer" },
              min_fee_b: { type: "integer" },
              max_block_size: { type: "integer" },
              max_tx_size: { type: "integer" },
              max_bh_size: { type: "integer" },
              key_deposit: { type: "integer" },
              pool_deposit: { type: "integer" },
              max_epoch: { type: "integer" },
              optimal_pool_count: { type: "integer" },
              influence: { type: "integer" },
              monetary_expand_rate: { type: "integer" },
              treasury_growth_rate: { type: "integer" },
              decentralisation: { type: "integer" },
              entropy: { type: "string" },
              protocol_major: { type: "integer" },
              protocol_minor: { type: "integer" },
              min_utxo_value: { type: "integer" },
              min_pool_cost: { type: "integer" },
              nonce: { type: "string" },
              block_hash: { type: "string" },
              cost_models: { type: "string" },
              price_mem: { type: "integer" },
              price_step: { type: "integer" },
              max_tx_ex_mem: { type: "integer" },
              max_tx_ex_steps: { type: "integer" },
              max_block_ex_mem: { type: "integer" },
              max_block_ex_steps: { type: "integer" },
              max_val_size: { type: "integer" },
              collateral_percent: { type: "integer" },
              max_collateral_inputs: { type: "integer" },
              coins_per_utxo_size: { type: "integer" },
            },
          },
        },
      },
    },
  },
};

export const gettipOapiPath: OapiPath<GetTipDto> = {
  responses: {
    200: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              hash: { type: "string" },
              epoch_no: { type: "integer" },
              abs_slot: { type: "integer" },
              epoch_slot: { type: "integer" },
              block_no: { type: "integer" },
              block_time: { type: "integer" },
            },
          },
        },
      },
    },
  },
};
