import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ScoresClient as _scores_ScoresClient, ScoresDefinition as _scores_ScoresDefinition } from './scores/Scores';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  scores: {
    AggregateCategorydScoresResponse: MessageTypeDefinition
    OverallQualityScoreResponse: MessageTypeDefinition
    PeriodChangeResponse: MessageTypeDefinition
    PeriodComparisonRequest: MessageTypeDefinition
    Scores: SubtypeConstructor<typeof grpc.Client, _scores_ScoresClient> & { service: _scores_ScoresDefinition }
    ScoresByTicketResponse: MessageTypeDefinition
    TimeRangeRequest: MessageTypeDefinition
  }
}

