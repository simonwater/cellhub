import type { Knex } from 'knex';

export abstract class DuplicateTableQueryAbstract {
  constructor(protected readonly queryBuilder: Knex.QueryBuilder) {}

  abstract duplicateTableData(
    sourceTable: string,
    targetTable: string,
    newColumns: string[],
    oldColumns: string[],
    crossBaseLinkDbFieldNames: { dbFieldName: string; isMultipleCellValue: boolean }[]
  ): Knex.QueryBuilder;
}
