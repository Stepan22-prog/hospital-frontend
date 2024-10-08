import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import SpecializationPage from './SpecializationsPage';
import { specializationService } from '@/services/specialization';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Specializations',
};

export default async function Specialization() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['specializations'],
    queryFn: () => specializationService.getAll(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SpecializationPage />
    </HydrationBoundary>
  );
}
