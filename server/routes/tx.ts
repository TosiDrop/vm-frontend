import express from "express";
import { Dto } from "../../client/src/entities/dto";
import { typedErrorHandlerWrapper } from "../middlewares/error-handler";
import { TxService } from "../service/tx";
import { createErrorWithCode, HttpStatusCode } from "../utils/error";
const router = express.Router();

/** get unsigned transaction */
router.post(
  "/delegate",
  typedErrorHandlerWrapper<Dto.CreateDelegationTx>(async function (req, res) {
    const { poolId, address } = req.body;
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
  "/submit",
  typedErrorHandlerWrapper<Dto.SubmitTx>(async function (req, res) {
    const { signedWitness, txBody } = req.body;
    const tx = await TxService.createTxToSubmit(signedWitness, txBody);
    return res.status(200).send({
      tx,
    });
  })
);

router.post(
  "/transfer",
  typedErrorHandlerWrapper<Dto.CreateTransferTx>(async function (req, res) {
    const { fromAddress, toAddress, amountToSend } = req.body;
    const { witness, txBody } = await TxService.createTransferTx({
      fromAddress,
      toAddress,
      amountToSend,
    });
    return res.status(200).send({
      witness,
      txBody,
    });
  })
);

export default router;
