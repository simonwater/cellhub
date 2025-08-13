import type { IRatingFieldCustomizeAIConfig, IRatingFieldRatingAIConfig } from '@teable/core';
import { FieldAIActionType } from '@teable/core';
import { Pencil, Star } from '@teable/icons';
import { Selector } from '@teable/ui-lib/base';
import { Textarea } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { Fragment, useMemo } from 'react';
import { tableConfig } from '@/features/i18n/table.config';
import type { IFieldEditorRo } from '../type';
import { AttachmentSelect, FieldSelect, PromptEditorContainer } from './components';

interface IRatingFieldAiConfigProps {
  field: Partial<IFieldEditorRo>;
  onChange?: (partialField: Partial<IFieldEditorRo>) => void;
}

export const RatingFieldAiConfig = (props: IRatingFieldAiConfigProps) => {
  const { field, onChange } = props;
  const { aiConfig } = field;
  const { type } = aiConfig ?? {};

  const { t } = useTranslation(tableConfig.i18nNamespaces);

  const candidates = useMemo(() => {
    return [
      {
        id: FieldAIActionType.Rating,
        icon: <Star className="size-4" />,
        name: t('table:field.aiConfig.type.rating'),
      },
      {
        id: FieldAIActionType.Customization,
        icon: <Pencil className="size-4" />,
        name: t('table:field.aiConfig.type.customization'),
      },
    ];
  }, [t]);

  const onConfigChange = (
    key: keyof IRatingFieldRatingAIConfig | keyof IRatingFieldCustomizeAIConfig,
    value: unknown
  ) => {
    switch (key) {
      case 'type':
        return onChange?.({ aiConfig: { type: value } as IRatingFieldRatingAIConfig });
      case 'sourceFieldId':
        return onChange?.({
          aiConfig: { ...aiConfig, sourceFieldId: value as string } as IRatingFieldRatingAIConfig,
        });
      case 'attachPrompt':
        return onChange?.({
          aiConfig: {
            ...aiConfig,
            attachPrompt: value as string,
          } as IRatingFieldRatingAIConfig,
        });
      case 'prompt':
        return onChange?.({
          aiConfig: { ...aiConfig, prompt: value as string } as IRatingFieldCustomizeAIConfig,
        });
      case 'attachmentFieldIds':
        return onChange?.({
          aiConfig: {
            ...aiConfig,
            attachmentFieldIds: value as string[],
          } as IRatingFieldCustomizeAIConfig,
        });
      default:
        throw new Error(`Unsupported key: ${key}`);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-y-2">
        <span>{t('table:field.aiConfig.label.type')}</span>
        <Selector
          className="w-full"
          placeholder={t('table:field.aiConfig.placeholder.type')}
          selectedId={type}
          onChange={(id) => {
            onConfigChange('type', id);
          }}
          candidates={candidates}
        />
      </div>

      {type && type !== FieldAIActionType.Customization && (
        <Fragment>
          <div className="flex flex-col gap-y-2">
            <span>{t('table:field.aiConfig.label.sourceField')}</span>
            <FieldSelect
              selectedId={(aiConfig as IRatingFieldRatingAIConfig)?.sourceFieldId}
              onChange={(fieldId) => onConfigChange('sourceFieldId', fieldId)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span>{t('table:field.aiConfig.label.attachPrompt')}</span>
            <Textarea
              placeholder={t('table:field.aiConfig.placeholder.attachPromptForRating')}
              className="w-full"
              value={(aiConfig as IRatingFieldRatingAIConfig)?.attachPrompt || ''}
              onChange={(e) => {
                onConfigChange('attachPrompt', e.target.value);
              }}
            />
          </div>
        </Fragment>
      )}
      {type === FieldAIActionType.Customization && (
        <Fragment>
          <div className="flex flex-col gap-y-2">
            <PromptEditorContainer
              value={(aiConfig as IRatingFieldCustomizeAIConfig)?.prompt || ''}
              onChange={(value) => onConfigChange('prompt', value)}
              label={t('table:field.aiConfig.label.prompt')}
              placeholder={t('table:field.aiConfig.placeholder.prompt')}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <span>{t('table:field.default.attachment.title')}</span>
            <AttachmentSelect
              value={(aiConfig as IRatingFieldCustomizeAIConfig)?.attachmentFieldIds || []}
              onChange={(value) => onConfigChange('attachmentFieldIds', value)}
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};
