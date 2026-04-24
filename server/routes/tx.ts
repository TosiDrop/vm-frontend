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
    const { signedWitness, txBody, auxData } = req.body;
    const tx = await TxService.createTxToSubmit(signedWitness, txBody, auxData);
    return res.status(200).send({
      tx,
    });
  })
);

function validateTransferParams(body: {
  fromAddress?: string;
  toAddress?: string;
  amountToSend?: string;
}) {
  const { fromAddress, toAddress, amountToSend } = body;
  if (!fromAddress || !toAddress || !amountToSend) {
    throw createErrorWithCode(
      HttpStatusCode.BAD_REQUEST,
      "fromAddress, toAddress, and amountToSend are required"
    );
  }
  return { fromAddress, toAddress, amountToSend };
}

router.post(
  "/transfer",
  typedErrorHandlerWrapper<Dto.CreateTransferTx>(async function (req, res) {
    const { fromAddress, toAddress, amountToSend } = validateTransferParams(
      req.body
    );
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

router.post(
  "/claim",
  typedErrorHandlerWrapper<Dto.CreateClaimTx>(async function (req, res) {
    const { fromAddress, toAddress, amountToSend } = validateTransferParams(
      req.body
    );
    const { witness, txBody, auxData } = await TxService.createClaimTx({
      fromAddress,
      toAddress,
      amountToSend,
    });
    return res.status(200).send({
      witness,
      txBody,
      auxData,
    });
  })
);

export default router;
