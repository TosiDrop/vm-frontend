import express, { Request, Response } from "express";
import { Dto } from "../../client/src/entities/dto";
import { errorHandlerWrapper } from "../middlewares/error-handler";
import { TxService } from "../service/tx";
import { createErrorWithCode, HttpStatusCode } from "../utils/error";
const router = express.Router();

router.get(
  "/stake",
  errorHandlerWrapper(
    async (
      req: Request<
        {},
        {},
        Dto.CreateStakeTx["body"],
        Dto.CreateStakeTx["query"]
      >,
      res: Response<Dto.CreateStakeTx["response"]>
    ) => {
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
    }
  )
);

router.post(
  "/stake",
  errorHandlerWrapper(
    async (
      req: Request<{}, {}, Dto.SubmitTx["body"], Dto.SubmitTx["query"]>,
      res: Response<Dto.SubmitTx["response"]>
    ) => {
      const { signedWitness, txBody } = req.body;
      const tx = await TxService.createTxToSubmit(signedWitness, txBody);
      return res.status(201).send({
        tx,
      });
    }
  )
);

export default router;
