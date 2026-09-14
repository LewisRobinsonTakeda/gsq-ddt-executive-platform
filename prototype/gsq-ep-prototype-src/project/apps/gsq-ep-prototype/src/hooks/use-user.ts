import { useQuery } from '@tanstack/react-query';
import { getContext } from '@microsoft/power-apps/app';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const context = await getContext();
      return context.user;
    },
  });
};
