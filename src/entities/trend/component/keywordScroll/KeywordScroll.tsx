'use server';

import { View } from './ui/View';
import { Trend } from '../../model';

interface KeywordScrollProps {
  trends: Trend[];
}

export const KeywordScroll = async ({ trends }: KeywordScrollProps) => {
  return <View trends={trends} />;
};
