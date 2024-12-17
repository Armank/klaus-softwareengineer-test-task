import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/scores';
import { ScoresHandlers } from '../proto/scores/Scores';
import { GetAggregatedCategoryScores } from './endpoints/aggregatedCategoryScores.[get]';
import { GetScoresByTicket } from './endpoints/scoresByTicket.[get]';
import { GetOverallQualityScore } from './endpoints/overallQualityScore.[get]';
import { GetPeriodOverPeriodChange } from './endpoints/periodOverPeriodChange.[get]';

const PORT = 8082;
const PROTO_FILE = '../proto/scores.proto';
const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const protoDescriptor = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;
const scoringPackage = protoDescriptor.scores;

function main() {
  const server = getServer();

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Your server has started on port ${port}`);
    }
  );
}

function getServer() {
  const server = new grpc.Server();
  server.addService(scoringPackage.Scores.service, {
    GetAggregatedCategoryScores,
    GetScoresByTicket,
    GetOverallQualityScore,
    GetPeriodOverPeriodChange
  } as ScoresHandlers);

  return server;
}

main();
