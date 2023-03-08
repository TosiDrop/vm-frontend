import { Address } from "@emurgo/cardano-serialization-lib-nodejs";
import express from "express";
import { Dto } from "../../client/src/entities/dto";
import { typedErrorHandlerWrapper } from "../middlewares/error-handler";
const router = express.Router();

router.get(
  "/bech32-address",
  typedErrorHandlerWrapper<Dto.GetBech32Address>(async (req, res) => {
    const { addressInHex } = req.query;
    return res.send({
      addressInBech32: Address.from_hex(addressInHex).to_bech32(),
    });
  })
);

export default router;
