import { MagicAi } from '@teable/icons';
import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useChatEnabled } from '../hooks/useChatEnabled';
import { useChatPanelStore } from '../store/useChatPanelStore';

interface ChatTriggerProps {
  buttonClassName?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const ChatTriggerButton = ({ buttonClassName, children, onClick }: ChatTriggerProps) => {
  const chatEnabled = useChatEnabled();
  const { toggleVisible: toggleChatPanel } = useChatPanelStore();
  const { t } = useTranslation(['common']);

  const handleClick = () => {
    onClick?.();
    toggleChatPanel();
  };

  if (!chatEnabled) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={cn(
                'flex relative items-center justify-center px-2 opacity-50 cursor-default',
                buttonClassName
              )}
            >
              <MagicAi className="size-4 text-orange-500" />
              {children}
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent>
              <p>{t('common:billing.unavailableInPlanTips')}</p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <Button
      variant="ghost"
      size="xs"
      className={cn('flex relative', buttonClassName, {
        'opacity-50': !chatEnabled,
      })}
      onClick={handleClick}
    >
      <MagicAi className="size-4 text-orange-500" />
      {children}
    </Button>
  );
};
