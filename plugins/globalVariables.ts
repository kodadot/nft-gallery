import { OperatorMap, OperatorType, useOperators } from 'mingo/core'
import { $avg, $first, $push, $sum } from 'mingo/operators/accumulator'
import { $group, $match, $project } from 'mingo/operators/pipeline'
import 'setimmediate'

export default async () => {
  // ensure the required operators are preloaded prior to using them.
  useOperators(OperatorType.PIPELINE, {
    $match,
    $group,
    $project,
  } as OperatorMap)
  useOperators(OperatorType.ACCUMULATOR, {
    $sum,
    $first,
    $push,
    $avg,
  } as OperatorMap)
}
