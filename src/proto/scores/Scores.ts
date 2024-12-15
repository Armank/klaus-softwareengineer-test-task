// Original file: src/proto/scores.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  AggregateCategorydScoresResponse as _scores_AggregateCategorydScoresResponse,
  AggregateCategorydScoresResponse__Output as _scores_AggregateCategorydScoresResponse__Output
} from '../scores/AggregateCategorydScoresResponse';
import type {
  OverallQualityScoreResponse as _scores_OverallQualityScoreResponse,
  OverallQualityScoreResponse__Output as _scores_OverallQualityScoreResponse__Output
} from '../scores/OverallQualityScoreResponse';
import type {
  PeriodChangeResponse as _scores_PeriodChangeResponse,
  PeriodChangeResponse__Output as _scores_PeriodChangeResponse__Output
} from '../scores/PeriodChangeResponse';
import type {
  PeriodComparisonRequest as _scores_PeriodComparisonRequest,
  PeriodComparisonRequest__Output as _scores_PeriodComparisonRequest__Output
} from '../scores/PeriodComparisonRequest';
import type {
  ScoresByTicketResponse as _scores_ScoresByTicketResponse,
  ScoresByTicketResponse__Output as _scores_ScoresByTicketResponse__Output
} from '../scores/ScoresByTicketResponse';
import type {
  TimeRangeRequest as _scores_TimeRangeRequest,
  TimeRangeRequest__Output as _scores_TimeRangeRequest__Output
} from '../scores/TimeRangeRequest';

export interface ScoresClient extends grpc.Client {
  GetAggregatedCategoryScores(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_scores_AggregateCategorydScoresResponse__Output>;
  GetAggregatedCategoryScores(
    argument: _scores_TimeRangeRequest,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_scores_AggregateCategorydScoresResponse__Output>;
  getAggregatedCategoryScores(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_scores_AggregateCategorydScoresResponse__Output>;
  getAggregatedCategoryScores(
    argument: _scores_TimeRangeRequest,
    options?: grpc.CallOptions
  ): grpc.ClientReadableStream<_scores_AggregateCategorydScoresResponse__Output>;

  GetOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  GetOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  getOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  getOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  getOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;
  getOverallQualityScore(
    argument: _scores_TimeRangeRequest,
    callback: grpc.requestCallback<_scores_OverallQualityScoreResponse__Output>
  ): grpc.ClientUnaryCall;

  GetPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;
  getPeriodOverPeriodChange(
    argument: _scores_PeriodComparisonRequest,
    callback: grpc.requestCallback<_scores_PeriodChangeResponse__Output>
  ): grpc.ClientUnaryCall;

  GetScoresByTicket(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  GetScoresByTicket(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  GetScoresByTicket(
    argument: _scores_TimeRangeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  GetScoresByTicket(
    argument: _scores_TimeRangeRequest,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  getScoresByTicket(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  getScoresByTicket(
    argument: _scores_TimeRangeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  getScoresByTicket(
    argument: _scores_TimeRangeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
  getScoresByTicket(
    argument: _scores_TimeRangeRequest,
    callback: grpc.requestCallback<_scores_ScoresByTicketResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface ScoresHandlers extends grpc.UntypedServiceImplementation {
  GetAggregatedCategoryScores: grpc.handleServerStreamingCall<
    _scores_TimeRangeRequest__Output,
    _scores_AggregateCategorydScoresResponse
  >;

  GetOverallQualityScore: grpc.handleUnaryCall<
    _scores_TimeRangeRequest__Output,
    _scores_OverallQualityScoreResponse
  >;

  GetPeriodOverPeriodChange: grpc.handleUnaryCall<
    _scores_PeriodComparisonRequest__Output,
    _scores_PeriodChangeResponse
  >;

  GetScoresByTicket: grpc.handleUnaryCall<
    _scores_TimeRangeRequest__Output,
    _scores_ScoresByTicketResponse
  >;
}

export interface ScoresDefinition extends grpc.ServiceDefinition {
  GetAggregatedCategoryScores: MethodDefinition<
    _scores_TimeRangeRequest,
    _scores_AggregateCategorydScoresResponse,
    _scores_TimeRangeRequest__Output,
    _scores_AggregateCategorydScoresResponse__Output
  >;
  GetOverallQualityScore: MethodDefinition<
    _scores_TimeRangeRequest,
    _scores_OverallQualityScoreResponse,
    _scores_TimeRangeRequest__Output,
    _scores_OverallQualityScoreResponse__Output
  >;
  GetPeriodOverPeriodChange: MethodDefinition<
    _scores_PeriodComparisonRequest,
    _scores_PeriodChangeResponse,
    _scores_PeriodComparisonRequest__Output,
    _scores_PeriodChangeResponse__Output
  >;
  GetScoresByTicket: MethodDefinition<
    _scores_TimeRangeRequest,
    _scores_ScoresByTicketResponse,
    _scores_TimeRangeRequest__Output,
    _scores_ScoresByTicketResponse__Output
  >;
}
