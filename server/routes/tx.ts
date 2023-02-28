import express, { Request, Response } from "express";
import { StakeTxDto } from "../../client/src/entities/dto";
import { errorHandlerWrapper } from "../middlewares/error-handler";
import { TxService } from "../service/tx";
import { createErrorWithCode, HttpStatusCode } from "../utils/error";
const router = express.Router();

/** get unsigned transaction */
router.get(
  "/stake",
  errorHandlerWrapper(async function (
    req: Request<any, any, any, StakeTxDto.GetTxRequest>,
    res: Response<StakeTxDto.GetTxResponse>
  ) {
    const { poolId, address } = req.query;
    if (!poolId) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "Pool ID must be specified"
      );
    }
    if (!address) {
      throw createErrorWithCode(
        HttpStatusCode.BAD_REQUEST,
        "User address must be specified"
      );
    }
    const delegationTx = await TxService.createDelegationTx(poolId, address);
    return res.status(200).send(delegationTx);
  })
);

/** post signed transaction */
router.post(
  "/stake",
  errorHandlerWrapper(async function (
    req: Request<any, any, StakeTxDto.PostSignedTxRequest>,
    res: Response<StakeTxDto.PostSignedTxResponse>
  ) {
    const { signedWitness, txBody } = req.body;
    const tx = await TxService.createTxToSubmit(signedWitness, txBody);
    return res.status(201).send({
      tx,
    });
  })
);

export default router;
