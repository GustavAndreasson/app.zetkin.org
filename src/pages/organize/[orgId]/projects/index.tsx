import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { Box, Grid, Typography } from '@mui/material';

import ActivitiesOverview from 'features/campaigns/components/ActivitiesOverview';
import AllCampaignsLayout from 'features/campaigns/layout/AllCampaignsLayout';
import CampaignCard from 'features/campaigns/components/CampaignCard';
import getCampaigns from 'features/campaigns/fetching/getCampaigns';
import getEvents from 'features/events/fetching/getEvents';
import getOrg from 'utils/fetching/getOrg';
import getUpcomingEvents from 'features/events/fetching/getUpcomingEvents';
import { PageWithLayout } from 'utils/types';
import { scaffold } from 'utils/next';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'features/campaigns/l10n/messageIds';
import useServerSide from 'core/useServerSide';

const scaffoldOptions = {
  authLevelRequired: 2,
  localeScope: [
    'layout.organize',
    'misc.breadcrumbs',
    'pages.organizeAllCampaigns',
    'misc.formDialog',
    'misc.speedDial',
  ],
};

export const getServerSideProps: GetServerSideProps = scaffold(async (ctx) => {
  const { orgId } = ctx.params!;

  await ctx.queryClient.prefetchQuery(
    ['org', orgId],
    getOrg(orgId as string, ctx.apiFetch)
  );
  const orgState = ctx.queryClient.getQueryState(['org', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['campaigns', orgId],
    getCampaigns(orgId as string, ctx.apiFetch)
  );
  const campaignsState = ctx.queryClient.getQueryState(['campaigns', orgId]);

  await ctx.queryClient.prefetchQuery(
    ['upcomingEvents', orgId],
    getUpcomingEvents(orgId as string, ctx.apiFetch)
  );
  const upcomingEventsState = ctx.queryClient.getQueryState([
    'upcomingEvents',
    orgId,
  ]);

  await ctx.queryClient.prefetchQuery(
    ['events', orgId],
    getEvents(orgId as string, ctx.apiFetch)
  );
  const eventsState = ctx.queryClient.getQueryState(['events', orgId]);

  if (
    orgState?.status === 'success' &&
    campaignsState?.status === 'success' &&
    eventsState?.status === 'success' &&
    upcomingEventsState?.status === 'success'
  ) {
    return {
      props: {
        orgId,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}, scaffoldOptions);

type AllCampaignsSummaryPageProps = {
  orgId: string;
};

const AllCampaignsSummaryPage: PageWithLayout<AllCampaignsSummaryPageProps> = ({
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const campaignsQuery = useQuery(['campaigns', orgId], getCampaigns(orgId));
  const eventsQuery = useQuery(['events', orgId], getEvents(orgId));

  const onServer = useServerSide();
  if (onServer) {
    return null;
  }

  const campaigns = campaignsQuery.data || [];
  const events = eventsQuery.data || [];

  return (
    <>
      <Head>
        <title>{messages.layout.allCampaigns()}</title>
      </Head>
      <ActivitiesOverview orgId={parseInt(orgId)} />
      <Box mt={4}>
        <Typography mb={2} variant="h4">
          <Msg id={messageIds.all.heading} />
        </Typography>

        <Grid container spacing={2}>
          {campaigns.map((campaign) => {
            return (
              <Grid key={campaign.id} item lg={3} md={4} xs={12}>
                <CampaignCard campaign={campaign} events={events} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

AllCampaignsSummaryPage.getLayout = function getLayout(page) {
  return <AllCampaignsLayout>{page}</AllCampaignsLayout>;
};

export default AllCampaignsSummaryPage;
